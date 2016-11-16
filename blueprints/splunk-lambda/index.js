/**
 * Splunk logging for AWS Lambda
 *
 * This function logs to a Splunk host using Splunk's event collector
 * API.
 *
 * Follow these steps to configure the function to log to your Splunk
 * host:
 *
 * 1. Enter url address for your Splunk HTTP event collector endpoint.
 * Default port for event collector is 8088. Make sure no firewalls would prevent
 * your Lambda function from connecting to this port on your Splunk host(s).
 *
 * 2. Enter token for your Splunk HTTP event collector. To create a new token
 * for this Lambda function, refer to Splunk Docs:
 * http://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token
 */

var Logger = require("./lib/mysplunklogger");

var loggerConfig = {
    url: "https://localhost:8088/services/collector",
    token: "31B1B444-0DD4-46C5-BC01-FCC0C8819E7D"
};
 
var logger = new Logger(loggerConfig);

// User code
exports.handler = function(event, context, callback) {
    //log strings
    logger.log(`value1 = ${event.key1}`, context);
    logger.log(`value2 = ${event.key2}`, context);
    logger.log(`value3 = ${event.key3}`, context);
    
    //log JSON objects
    logger.log(event, context);
    console.log(event);

    //specify the timestamp explicitly, useful for forwarding events like from AWS IOT
    logger.logWithTime(Date.now(), event, context);

    //send all the events in a single batch to Splunk
    logger.flushAsync((error, response) => {
        if (error) {
            callback(error);
        } else {
            callback(null, event.key1); // Echo back the first key value
        }
    });
};