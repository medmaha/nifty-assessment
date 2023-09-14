const saveButtons = document.querySelectorAll("[data-save-as]")

saveButtons.forEach((element) => {
    element.addEventListener("click", handleSaveElementClick)
})

console.log(CSRF_TOKEN)

function handleSaveElementClick(ev) {
    const button = ev.currentTarget

    const template_url = button.dataset.template

    function cb() {
        // target.removeAttribute("data-printer")
    }

    console.log(button.dataset)

    if (!template_url) return
    if (button.dataset.saveAs === "pdf") return pdfHandler(button, cb)
    if (button.dataset.saveAs === "doc") return docxHandler(template_url, cb)
    if (button.dataset.saveAs === "txt") return txtHandler(template_url, cb)
    if (button.dataset.saveAs === "csv") return csvHandler(template_url, cb)
}

function pdfHandler(button) {
    const form = button.dataset

    let url = `/download/pdf?model=${form.model || 0}&model_id=${
        form.modelId || 0
    }&template_url=${form.template || 0}`

    fetch(url, {
        method: "get",
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err))
    //
}
function docxHandler(element) {
    console.log("DOCX")
    console.log(element)
}
function txtHandler(element) {
    console.log("TXT")
    console.log(element)
}
function csvHandler(element) {
    console.log("CSV")
    console.log(element)
}
