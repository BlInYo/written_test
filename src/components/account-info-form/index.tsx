import { Form, FormProps, Input, Modal, ModalProps } from 'antd'
import * as React from 'react'
import { AccountInfo } from '../../types'

type AccountInfoFormProps = {
  mode: 'edit' | 'add'
  form: FormProps['form']
  info?: AccountInfo
} & ModalProps

const FormItem = Form.Item
const { Password } = Input
const AccountInfoForm: React.FC<AccountInfoFormProps> = (props) => {
  const { mode, info, form, open, ...modalProps } = props
  window.form = form
  const password = Form.useWatch('password', form)

  // 关闭modal的时候清空表单
  React.useEffect(() => {
    if (open) {
      return
    }
    form?.resetFields()
  }, [open])

  // 编辑模式打开modal回填信息
  React.useEffect(() => {
    if (!open) {
      return
    }
    if (mode !== 'edit') {
      return
    }
    form?.setFieldsValue({
      ...info,
      confirm_password: info?.password,
    })
  }, [open, mode, info])

  return (
    <Modal open={open} {...modalProps}>
      <Form form={form} layout="vertical">
        <FormItem label="用户名" name="name" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input />
        </FormItem>
        <FormItem
          label="邮箱地址"
          name="email"
          required
          rules={[
            {
              validator(_rule, value, callback) {
                if (!value) {
                  callback('请输入邮箱地址')
                }
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                  callback('请输入合法的邮箱地址')
                }
              },
            },
          ]}
        >
          <Input></Input>
        </FormItem>
        <FormItem label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Password />
        </FormItem>
        <FormItem
          label="确认密码"
          name="confirm_password"
          required
          rules={[
            {
              validator(_rule, value, callback) {
                if (!value) {
                  callback('请再次输入密码')
                }
                if (value !== password) {
                  callback('密码不一致请确认密码')
                }
              },
            },
          ]}
        >
          <Password />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default AccountInfoForm
