import React from 'react';


const initialFieldValues = {
    host: "",
    username: "",
    password: ""
};

const DashboardSelect = () => {
    // const [form] = Form.useForm();
    return (
        <Box>
            <Typography variant="h5">BASIC WITH MATERIAL UI</Typography>
            <form name="validateOnly" layout="vertical" autoComplete="off">
                <TextField
                    style={{ width: "200px", margin: "5px" }}
                    type="text"
                    label="setgoal"
                    variant="outlined"
                />
            </form>
        </Box>
    );
}
export default DashboardSelect;
