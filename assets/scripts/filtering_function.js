
function filteredTwoDimData(twoDimData, tag) {

    // Initialize a new array
    var newTwoDimData = []

    // Create a temp Cat1Dim element to get the values of the twoDimData
    var tempCat1Dim = new Cat1Dim("temp")

    // SPECIAL CASE: tag = "Small" (cretes an issue with "Very Small")
    if (tag == "Small") {

        // For each line of the incoming array
        for (var i = 0; i < twoDimData.length; i++) {

            // If "Very Small" is not found
            if (twoDimData[i].nameCat.search("Very Small") < 0) {

                // If "Small" is found
                if (twoDimData[i].nameCat.search("Small") >= 0) {

                    tempCat1Dim = new Cat1Dim("temp")

                    // Fill the temp element with the values of the element
                    tempCat1Dim.nameCat = twoDimData[i].nameCat
                    tempCat1Dim.n = twoDimData[i].n
                    tempCat1Dim.c = twoDimData[i].c
                    tempCat1Dim.rate = twoDimData[i].rate
                    tempCat1Dim.LB = twoDimData[i].LB
                    tempCat1Dim.UB = twoDimData[i].UB

                    // Change the value of the tag in the temp element
                    tempCat1Dim.nameCat = tempCat1Dim.nameCat.replace("Small", "")
                    tempCat1Dim.nameCat = tempCat1Dim.nameCat.replace(" - ", "")

                    // Push the temp element into out array
                    newTwoDimData.push(tempCat1Dim)
                }
            }
        }
    } else if (tag != "empty") { // NORMAL CASE: tag is not "Small"

        // For each line of the incoming array
        for (var i = 0; i < twoDimData.length; i++) {

            // If the tag is found
            if (twoDimData[i].nameCat.search(tag) >= 0) {

                tempCat1Dim = new Cat1Dim("temp")

                // Fill the temp element with the values of the element
                tempCat1Dim.nameCat = twoDimData[i].nameCat
                tempCat1Dim.n = twoDimData[i].n
                tempCat1Dim.c = twoDimData[i].c
                tempCat1Dim.rate = twoDimData[i].rate
                tempCat1Dim.LB = twoDimData[i].LB
                tempCat1Dim.UB = twoDimData[i].UB

                // Change the value of the tag in the temp element
                tempCat1Dim.nameCat = tempCat1Dim.nameCat.replace(tag, "")
                tempCat1Dim.nameCat = tempCat1Dim.nameCat.replace(" - ", "")

                // Push the temp element into out array
                newTwoDimData.push(tempCat1Dim)
            }
        }
    } else {
        newTwoDimData = twoDimData
    }

    return newTwoDimData;
}