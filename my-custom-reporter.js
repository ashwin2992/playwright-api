class MyReporter {
  constructor(options) {
    console.log(`my-custom-reporter setup with customOption set to ${options.customOption}`);
  }

  onBegin(config, suite) {
    console.log('****************************************************');
    console.log(`Starting the run with ${suite.allTests().length} tests`);
   console.log('****************************************************');
  }

  onTestBegin(test) {
    console.log('----------------------------------------------------');
    console.log(`Starting test ${test.title}`);
    console.log('----------------------------------------------------');
  }

  onTestEnd(test, result) {
    console.log(`Finished test ${test.title}: ${result.status}`);
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
  }

  onEnd(result) {
    console.log(`Finished the run: ${result.status}`);
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  }
}
module.exports = MyReporter;