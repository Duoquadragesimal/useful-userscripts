// ==UserScript==
// @name         Sparx thing
// @namespace    https://github.com/Duoquadragesimal
// @version      1.0.0.6
// @description  sparx SUCKS ASS and BUTTOCKS
// @author       Big Z
// @match        https://*.sparxmaths.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sparxmaths.com
// @updateURL    https://github.com/Duoquadragesimal/useful-userscripts/raw/main/scripts/sparx.user.js
// @downloadURL  https://github.com/Duoquadragesimal/useful-userscripts/raw/main/scripts/sparx.user.js
// ==/UserScript==
(function() {
    'use strict';
    const targetNode = document.querySelector("body");
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
    };
    window.lastBWCode = "It doesn't matter what this string is as long as it isn't a possible bookwork code.";
    window.lastBWCheck = document.createElement("null")
    window.lastanswerHTML = document.createElement("null")
    window.currentHomework = ""
    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.closest("div.homework")) {
            let temp = event.target.closest("div.package").querySelector(".package-title").textContent;
            if (temp != window.currentHomework){
                window.currentHomework = temp
                let stringy = window.localStorage.getItem(window.currentHomework);
                if (stringy!==null) {
                    window.thisHWDict = JSON.parse(window.localStorage.getItem(window.currentHomework));
                }
                else {
                    window.thisHWDict = {}
                }
            }
        }
    });
    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            if (document.querySelector("span.location-title")!== null) {
                if (document.querySelector("span.location-title").textContent == "Independent Learning") {
                    window.currentHomework = "Independent Learning"
                }
            }
            //mutation.addedNodes.forEach((mutation) => {
            const bwcodeExists = document.querySelector(".bookwork-code span");
            if (bwcodeExists) {
                var bwcode = bwcodeExists.textContent.slice(15);
                if (!(bwcode == window.lastBWCode)) {
                    window.lastBWCode = bwcode;
                    //console.log(bwcode);
                };
            };
            const answerWasCorrect = document.querySelector("h1.correct");
            if (answerWasCorrect) {
                //debugger;
                try {
                    window.answerText = []
                    var answerHTML = document.querySelector("div.answer").innerHTML;
                    const range = document.createRange();
                    const answerFragment = range.createContextualFragment(answerHTML);
                    if (!(answerFragment.isEqualNode(window.lastanswerHTML))) {
                        //console.log(answerFragment);
                        //CHOICES ANSWER METHOD
                        var pee = answerFragment.querySelectorAll("div.choice.choice-image.selected img")
                        if (pee.length != 0) {
                            for (let i=0; i<pee.length/2; i++) {
                                window.answerText.push(pee[2*i+1].src)
                            }
                        }
                        if (answerFragment.querySelector("div.choices")) {
                            let selectedAnswers = answerFragment.querySelectorAll("div.selected");
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                let text = selectedAnswers[i].textContent;
                                window.answerText.push(text);
                            };
                        }
                        //CARDS ANSWER METHOD
                        else if (answerFragment.querySelector("div.cards")) {
                         let selectedAnswers = answerFragment.querySelectorAll("div.slot:not(.slot-locked)")
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                let text = selectedAnswers[i].textContent;
                                window.answerText.push(text);
                            }
                        }
                        //SMALL CARDS WITH ENTRY AREA ANSWER METHOD (ANSWER PART)
                        else if (answerFragment.querySelector("div.gap-slot")) {
                         let selectedAnswers = answerFragment.querySelectorAll("div.gap-slot")
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                let text = selectedAnswers[i].textContent;
                                window.answerText.push(text);
                            }
                        }
                        //KEYPAD INPUT
                        else if (answerFragment.querySelector("div.keypad-number-input")) {
                            let selectedAnswers = answerFragment.querySelectorAll("input.number-input")
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                let text = selectedAnswers[i].value;
                                window.answerText.push(text);
                            }
                        }
                        window.lastanswerHTML = answerFragment;
                        const storage = window.localStorage;
                        if (window.currentHomework !== "Independent Learning") {
                            window.thisHWDict[window.lastBWCode] = window.answerText
                            storage.setItem(window.currentHomework,JSON.stringify(window.thisHWDict))
                        }
                    }
                }
                catch(err){}
            };
            var isBWCheck = document.querySelector("div.wac-box")
            if (isBWCheck!==null && (isBWCheck != window.lastBWCheck)) {
                window.lastBWCheck = isBWCheck
                let checkCode = isBWCheck.querySelector("div.bookwork-code").textContent.slice(15);
                //console.log(checkCode);
                let correctChoiceText = window.thisHWDict[checkCode];
                //console.log(correctChoiceText)
                var choices = isBWCheck.querySelectorAll("div.choice-wac-option");
                var counter = 0;
                var correctIndex;
                var foundSolution = false
                for (let i = 0; i < choices.length; i++) {
                    if (choices[i].querySelector("img") == null) {
                        let answerBlocks = choices[i].querySelectorAll("span.answer-block")
                        //console.log(answerBlocks)
                        var answerBlockValues = []
                        for (let g = 0; g < answerBlocks.length; g++) {
                            answerBlockValues.push(answerBlocks[g].textContent);
                        }
                        //console.log(answerBlockValues)
                        var success = correctChoiceText.every(function(val) {
                            return (answerBlockValues.indexOf(val) !== -1) || (answerBlockValues.indexOf(val+"{"+val+"}"+val) !== -1);
                        });
                        if (success) {
                            correctIndex = i
                            foundSolution = true
                        }
                    }
                    else {
                        let answerImages = choices[i].querySelectorAll("img")
                        let answerImageURLs = []
                        for (let g = 0; g < answerImages.length; g++) {
                            answerImageURLs.push(answerImages[g].src)
                        }
                        if (answerImageURLs.includes(correctChoiceText)) {
                            correctIndex = i
                            foundSolution = true
                        }
                    }
                };
                choices[correctIndex].style = "background-color: #00ff00 !important;"
                if (foundSolution == false) {
                    console.log("You're probably looking here because the bookwork check answer was not highlighted. That's what the error above is about")
                    console.log("The script will now log some things - the code for this bookwork check screen, and the list of bookwork checks with answers.")
                    console.log("For each of them, please right click, then click \"copy object\" (presuming you are on a Chrome-based browser).")
                    console.log("Then send them to me so I can fix it, either on Discord or Github Issues (https://github.com/Duoquadragesimal/useful-userscripts/issues).")
                    console.log(window.thisHWDict)
                    console.log(window.lastBWCheck)
                }
            }
            var homeworkPackages = document.querySelectorAll("div.package");
            for (let i = 0; i < homeworkPackages.length; i++) {
                let temp = homeworkPackages[i].querySelector(".package-title").textContent;
                if (!(homeworkPackages[i].querySelector("span.complete") == null)) {
                    window.localStorage.removeItem(temp)
                }
            }
        });
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);
})();
