/*
 * Main file allowing the creation of the tool.
 */
(function (d3) {

  /******************** DATA LOADING FROM THE CSV ********************/
  d3.csv("data/data_project.csv").then(function(d) {

    /******************** PREPROCESSING ********************/
    // Get the client list from the .csv data
    var cList = getClientList(d);

    // Get the data needed for the analysis of the conversion rates
    [channelD, countryD, sizeD] = getConversionRateData(cList, 60);

    // Get the data needed for the analysis of the conversion rates - 2D
    var countrychannelD;
    var countrysizeD;
    var channelsizeD;
    [countrychannelD, countrysizeD, channelsizeD] = getConversionRateData2D(cList, 60)

    // Get the data needed for the trial analysis 
    var trialD = getTrialData(cList, 60)

    // Get the data needed for the journey analysis 
    var journeyD = getJourneyData(cList, 90)

    /******************** CREATION OF THE OVERVIEW AND TABS ********************/
    var dashboardWidth = 1200
    createOverview(cList, dashboardWidth, countryD, sizeD);
    createConversionRates(channelD, countryD, sizeD, countrychannelD, countrysizeD, channelsizeD, dashboardWidth);
    createTrialAnalysis (trialD, countryD, dashboardWidth);
    createCustomerJourney(cList, journeyD, dashboardWidth);

    // Open a tab on startup
    var defaultTab = 'V1tab'
    openTab(event, defaultTab)
  })

})(d3);