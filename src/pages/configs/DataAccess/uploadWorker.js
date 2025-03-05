self.onmessage = async (event) => {
    const {file} = event.data;
    // const formData = new FormData();
    // formData.append('file', file)

    try{
        const response = await fetch('', {
            method: 'POST',
            body: formData
        })
        const result = await response.json();
        self.postMessage({type: 'success', message: result.message})
    } catch (error) {
        self.postMessage({type: 'error', message: error.message})
    }
}
