let currentQuestion = 0;
let answers = [];
// On page load
function reset() {
    currentQuestion = 0;
    answers = [];
    resultArray = [];
    $('#chatbotContainer').empty();
    $.getJSON('/reset',
        function (data) {
            // Do nothing
        }
    );
    // Redirect to /reset
    location.href = window.location.href + 'reset';
}

function questionsComplete() {
    let finished = true;
    for (let i = 0; i < answers.length; i++) {
        console.log(answers[i][1]);
        if (answers[i][1] == null) {
            finished = false;
        }
    }
    return finished;
}

function displayQuestion(num) {
    if (questionsComplete() == true) {
        console.log(answers);
        userAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            userAnswers.push(answers[i][1]);
        }

        $.getJSON('/submitClicked/' + userAnswers,
            function (data) {}
        );
        userAnswers = [];
        url = window.location.protocol + '//' + window.location.host
        console.log(url)
        console.log("userAnswers",userAnswers);
        setTimeout(function(){
            window.location.assign(url)}, 250);
    } else {
        
        $('#chatbotContainer').append(
            `
            <div class="chatbotMessage">
                <div class="chatbotMessageText">
                <h1>
                    ${questions[num]}

                </h1>
                </div>
            </div>
            `);
    }
}

$(function () {
    console.log("resultArray",resultArray);
    console.log("answers",answers);
    if (resultArray.length != 0) {
        console.log("resultArray",resultArray);
        // wipe chatbotContainer
        $('#chatbotContainer').empty();
        // Append resultsArray to chatbotContainer
        // Hide chatbotInputContainer ID
        $('#chatbotInputContainer').hide();
        for (let i = 0; i < resultArray.length; i++) {
            // Append a bootstrap card
            $('#cardContainer').append(



                `
                
                <div class="card centered-div" style="width: 18rem;">
                <img class="card-img-top" src="https://unsplash.it/400/200" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">` + resultArray[i][1] + `</h5>
                    <p class="card-text">A hotel situated in ` + resultArray[i][2] + ', ' + resultArray[i][3] + `</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
                </div>
                
                
                
                
                `
            );
        }
        $('#chatbotContainer').empty();
        resultArray = [];
        // Add reset button
        $('#chatbotContainer').append(
            `
            <div class="chatbotMessage">
                <div class="chatbotMessageText">
                    <button id="resetButton" class = "btn btn-primary" onclick="reset();">Reset</button>
                </div>
            </div>
            `);
    } else {

        currentQuestion = 0;
        for (let i = 0; i < questions.length; i++) {
            answers.push([questions[i], null])
        }
        displayQuestion(currentQuestion);

        console.log(answers);
        // Adds submit function to button chatbotSend
        $('#chatbotSend').on('click', function (e) {
            // Gets the value of the input field
            let inputtedVal = $('#chatbotInput').val();
            e.preventDefault()
            //   Check if inputted value is empty
            let sentArgs = ""
            // If inputted value is empty, do nothing
            if (inputtedVal == '') {
                sentArgs = "0";
            } else {
                sentArgs = inputtedVal;
                // console.log("Would send: " + sentArgs);
                // $.getJSON('/submitClicked/' + sentArgs,
                //     function (data) {
                //         //do nothing
                //     });
                answers[currentQuestion][1] = sentArgs;
                currentQuestion++;
                // Display next question
                $('#chatbotInput').val('');
                displayQuestion(currentQuestion);

            }
        });
    }
});





// Allows accessbility 
$("#chatbotInput").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#chatbotSend").click();
    }
});