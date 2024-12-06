import './App.css'
import * as React from 'react'
import { Button, Form, message, Popconfirm, Table, TableProps } from 'antd'
import { AccountInfo, AccountStatus } from './types'
import AccountInfoForm from './components/account-info-form'

const AccountStatusMap = {
  [AccountStatus.Active]: '使用中',
  [AccountStatus.Delete]: '已删除',
}
const App = () => {
  const [form] = Form.useForm()

  const [accountData, setAccountData] = React.useState<AccountInfo[]>([])

  const [accountInfo, setAccountInfo] = React.useState<AccountInfo>()

  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const [modalMode, setModalMode] = React.useState<'edit' | 'add'>('add')
  const modalTitle = React.useMemo(() => (modalMode === 'add' ? '新增用户' : '修改用户信息'), [modalMode])

  /** 删除 */
  const handleDeleteAccount = (accountId: string) => {
    const index = accountData.findIndex((item) => item.id === accountId)
    if (index === -1) {
      message.error('删除失败，为成功找到该账户')
    }
    setAccountData((prev) => {
      const newArr = prev.map((item) => ({ ...item }))
      newArr.splice(index, 1)
      return newArr
    })
  }

  /** 修改 */
  const handleUpdateAccount = (accountId: string) => {
    setModalMode('edit')
    setModalVisible(true)
    const accountInfo = accountData.find((item) => item.id === accountId)
    setAccountInfo(accountInfo)
  }

  const handleCreateAccount = () => {
    const formData = form.getFieldsValue()
    const _accountInfo: AccountInfo = {
      id: `${new Date().getTime()}`,
      create_time: new Date().getTime(),
      status: AccountStatus.Active,
      ...formData,
    }
    if (modalMode === 'add') {
      setAccountData((prev) => {
        const newArr = prev.map((item) => ({ ...item }))
        newArr.unshift(_accountInfo)
        return newArr
      })
    } else {
      setAccountData((prev) => {
        const newArr = prev.map((item) => ({ ...item }))
        const index = newArr.findIndex((item) => item.id === accountInfo?.id)
        newArr.splice(index, 1, {
          ...accountInfo,
          ...formData,
        })
        return newArr
      })
      setAccountInfo(undefined)
    }

    setModalVisible(false)
  }

  /** 新增 */
  const handleAddAccount = () => {
    setModalMode('add')
    setModalVisible(true)
  }

  const columns: TableProps<AccountInfo>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: (val) => (val ? new Date(val).toLocaleString() : '--'),
    },
    {
      title: '账户状态',
      dataIndex: 'status',
      render: (val: AccountStatus) => (val ? AccountStatusMap[val] : '--'),
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <div>
            <Popconfirm
              title="确认删除？"
              description="确认删除该用户？此操作不可逆"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDeleteAccount(record.id)}
            >
              <Button disabled={record.status === AccountStatus.Delete} type="text">
                删除
              </Button>
            </Popconfirm>
            <Button
              disabled={record.status === AccountStatus.Delete}
              type="text"
              onClick={() => handleUpdateAccount(record.id)}
            >
              修改
            </Button>
          </div>
        )
      },
    },
  ]
  return (
    <div>
      <div style={{ margin: 12, textAlign: 'end' }}>
        <Button type="primary" onClick={handleAddAccount}>
          新增用户
        </Button>
      </div>
      <Table columns={columns} dataSource={accountData} />
      <AccountInfoForm
        form={form}
        info={accountInfo}
        mode={modalMode}
        open={modalVisible}
        title={modalTitle}
        onCancel={() => setModalVisible(false)}
        onOk={handleCreateAccount}
        okText="确认"
        cancelText="取消"
      />
    </div>
  )
}

export default App
