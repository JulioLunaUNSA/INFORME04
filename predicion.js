
const { exec }  = require('child_process')

exec('python descriptor.py', (err, stdout, stderr) => {

    let data = [];

    if (err) {
        console.log(`error: ${err.message}`);
    }

    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }

    var cadenas = stdout.split(" ")
    for (let index = 0; index < cadenas.length; index++) {
        //console.log(cadenas[index] + " / ");
        if (cadenas[index].includes("(")) {
            //console.log(cadenas[index].substring(cadenas[index].indexOf("(") + 1, cadenas[index].indexOf(",")) + "/ ");
            var pointX = cadenas[index].substring(cadenas[index].indexOf("(") + 1, cadenas[index].indexOf(","));
        }

        if (cadenas[index].includes(")")) {
            var pointy = cadenas[index].substring(0, cadenas[index].indexOf(")"));
        }

        if ((pointX != null || pointX != '') && (pointy != null || pointy != '')) {
            data.push([pointX, pointy]);
        }
    }

    console.log(data);
    // return data;
})