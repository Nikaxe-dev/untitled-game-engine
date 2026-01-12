const fs = require("fs")
const path = require("path")

function handleError(err) {
    if (!err) return
    console.error(err)
}

console.log("CLEARING BUILD DIRECTORY AND COPYING SOURCE CODE")
if(fs.existsSync(__dirname + "/build")) {
    fs.rmSync(__dirname + "/build", {recursive: true, force: true})
}
fs.cpSync(__dirname + "/src", __dirname + "/build", { recursive: true }, handleError)

console.log("REMOVING SOURCECODE FROM THE BUILD DIRECTORY")
function applybuild(directory, origindir = directory) {
    const children = fs.readdirSync(directory)

    children.forEach((file, index) => {
        const fulldirectory = path.join(directory, file)
        if(fs.lstatSync(fulldirectory).isFile()) {
            if(path.extname(fulldirectory) == ".ts") {
                fs.rmSync(fulldirectory, {force: true})
            }
        } else {
            applybuild(fulldirectory, origindir)
        }
    })
}
applybuild(__dirname + "/build")