import React from 'react';


const initialFieldValues = {
    host: "",
    username: "",
    password: ""
};

const DashboardSelect = () => {
    const [form] = Form.useForm();
    return (
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="age"
                label="Age"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Space>
                    <SubmitButton form={form}>Submit</SubmitButton>
                    <Button htmlType="reset">Reset</Button>
                </Space>
            </Form.Item>
        </Form>
    );
}
export default DashboardSelect;
