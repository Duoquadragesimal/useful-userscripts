// ==UserScript==
// @name         Sparx thing
// @namespace    https://github.com/Duoquadragesimal
// @version      1.1.0.0
// @description  sparx SUCKS ASS and BUTTOCKS
// @author       Big Z
// @match        https://*.sparxmaths.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sparxmaths.com
// @updateURL    https://github.com/Duoquadragesimal/useful-userscripts/raw/main/scripts/sparx.user.js
// @downloadURL  https://github.com/Duoquadragesimal/useful-userscripts/raw/main/scripts/sparx.user.js
// @grant        none
// ==/UserScript==
function main() {
    'use strict';
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.js";
    script.defer = "defer";
    //script.integrity="sha384-tsPOhveNsi36uhglzMBNOAA2xd7LlEqQuQHFKi4DwP+6UKrrLGub1MD77Zx18F8e";
    script.crossorigin="anonymous";
    //window.katex.render("katex string", "target node", "options")
    //console.log(window.katex.renderToString("katex string"))
    document.getElementsByTagName("head")[0].appendChild(script);
    //console.log(window.katex)
    const targetNode = document.querySelector("body");
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
    };
    try {
        let toldEm = window.localStorage.getItem("Told")
        if (toldEm == "true") {
            alert("Heyy!!!! Sparx bookwork checker fixed now I think! Check it out!!!🔥💯\n-Zak")
            window.localStorage.removeItem("Told")
        }
    }
    catch {}
    window.lastBWCode = "It doesn't matter what this string is as long as it isn't a possible bookwork code.";
    window.lastBWCheck = document.createElement("null")
    window.bwCheckCode = ""
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
                        window.lastanswerHTML = answerFragment;
                        console.log(window.currentHomework);
                        var images = answerFragment.querySelectorAll("div.choice.choice-image.selected img")
                        if (images.length != 0) {
                            for (let i=0; i<images.length/2; i++) {
                                window.answerText.push(images[2*i+1].src)
                            }
                        }
                        if (answerFragment.querySelector("div.choices")) {
                            let selectedAnswers = answerFragment.querySelectorAll("div.selected");
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                let text = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent;
                                window.answerText.push(text);
                            };
                        }
                        //CARDS ANSWER METHOD
                        if (answerFragment.querySelector("div.cards")) {
                            if (answerFragment.querySelector(".slots.fraction")) {
                                console.log("1")
                               let fractionParts = answerFragment.querySelectorAll("div.slots.fraction");
                               for (let i = 0; i < fractionParts.length; i++) {
                                   console.log("2")
                                   let selectedAnswers = fractionParts[i].querySelectorAll("div.slot:not(.slot-locked)")
                                   console.log(fractionParts)
                                   console.log(selectedAnswers)
                                   let vinculum = fractionParts[i].querySelector(".vinculum")
                                   let beforeVinculum = ""
                                   let afterVinculum = ""
                                   for (let i = 0; i < selectedAnswers.length; i++) {
                                       if (selectedAnswers[i].compareDocumentPosition(vinculum) & Node.DOCUMENT_POSITION_PRECEDING) {
                                           afterVinculum = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent
                                       } else {
                                           beforeVinculum = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent
                                       }
                                   }
                                   console.log("4")
                                   let text = "\\frac{" + beforeVinculum + afterVinculum + "}"
                                   console.log(text)
                                   window.answerText.push(text);
                                   console.log(window.answerText)
                               }
                               let selectedAnswers = answerFragment.querySelectorAll("div.slot:not(.slot-locked)")
                               for (let i = 0; i < selectedAnswers.length; i++) {
                                  if (selectedAnswers[i].closest("div.slots.fraction") === null) {
                                      let text = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent;
                                      window.answerText.push(text);
                                  }
                               }
                            }
                        }
                        //SMALL CARDS WITH ENTRY AREA ANSWER METHOD (ANSWER PART)
                       if (answerFragment.querySelector("div.gap-slot")) {
                            let selectedAnswers = answerFragment.querySelectorAll("div.gap-slot")
                            if (answerFragment.querySelector(".answer-part-fraction")) { //fraction answer
                                console.log(selectedAnswers)
                                let fractionParts = answerFragment.querySelectorAll("div.answer-part-fraction");
                                for (let i = 0; i < fractionParts.length; i++) {
                                    selectedAnswers = answerFragment.querySelectorAll("div.answer-part-fraction div.gap-slot")
                                    let vinculum = answerFragment.querySelector(".vinculum")
                                    let beforeVinculum = ""
                                    let afterVinculum = ""
                                    for (let i = 0; i < selectedAnswers.length; i++) {
                                        if (selectedAnswers[i].compareDocumentPosition(vinculum) & Node.DOCUMENT_POSITION_PRECEDING) {
                                            afterVinculum = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent
                                        } else {
                                            beforeVinculum = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent
                                        }
                                    }
                                    let text = "\\frac{" + beforeVinculum + afterVinculum + "}"
                                    //let text = String.raw("\frac{") + beforeVinculum + afterVinculum + "}" ;
                                    //console.log(text)
                                    window.answerText.push(text);
                                    console.log(window.answerText)
                                }
                            }
                            selectedAnswers = answerFragment.querySelectorAll("div.gap-slot")
                           var text = null
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                if (selectedAnswers[i].closest(".answer-part-fraction") === null) {
                                    if (selectedAnswers[i].querySelector("span.katex-mathml annotation")) {
                                        text = selectedAnswers[i].querySelector("span.katex-mathml annotation").textContent;
                                    }
                                    else {
                                        text = selectedAnswers[i].textContent;
                                    }
                                    window.answerText.push(text);
                                    console.log(window.answerText)
                                }
                            }
                        }
                        //KEYPAD INPUT
                        if (answerFragment.querySelector("div.keypad-number-input")) {
                            let selectedAnswers = answerFragment.querySelectorAll("input.number-input")
                            for (let i = 0; i < selectedAnswers.length; i++) {
                                let text = selectedAnswers[i].value;
                                window.answerText.push(text);
                            }
                        }
                        const storage = window.localStorage;
                        if (window.currentHomework !== "Independent Learning") {
                            if (window.answerText.every(function(val) {return !(val)})) {
                                window.answerText = prompt("The program failed to identify an answer for that last question.\nPlease type the answer here if you can remember it.\n-Big Z")
                            }
                            console.log(window.answerText)
                            window.thisHWDict[window.lastBWCode] = window.answerText
                            console.log(window.thisHWDict)
                            storage.setItem(window.currentHomework,JSON.stringify(window.thisHWDict))
                        }
                    }
                }
                catch {}
            };
            var isBWCheck = document.querySelector("div.wac-box");
            if (isBWCheck!==null) {
                var checkCode = isBWCheck.querySelector("div.bookwork-code").textContent.slice(15);
            }
            if (isBWCheck!==null && (isBWCheck != window.lastBWCheck) && (window.bwCheckCode !== checkCode)) {
                window.lastBWCheck = isBWCheck
                window.bwCheckCode = checkCode
                console.log(checkCode);
                console.log(window.thisHWDict);
                console.log("HWDict above, Check code below");
                console.log(checkCode);
                console.log(window.thisHWDict[checkCode])
                let correctChoiceText = (window.thisHWDict[checkCode]);
                console.log(correctChoiceText)
                console.log(window.katex)
                var holderBox = document.createElement("div")
                holderBox.className = "holderBox"
                holderBox.style.backgroundColor = "#aaeebb"
                holderBox.style.borderRadius = "5px"
                holderBox.style.display = "inline-flex"
                holderBox.style.alignItems = "center"
                holderBox.style.padding = "7px"
                holderBox.style.border = "3px solid #000000"
                document.querySelector("div.wac-text-container").insertAdjacentElement("afterEnd", holderBox)
                let text = document.createElement("p")
                text.innerText = "Correct Answer: "
                text.style.display = "block"
                text.style.paddingRight = "5px"
                holderBox.appendChild(text)
                for (let i=0; i < correctChoiceText.length; i++) {
                    let newChild = document.createElement("div")
                    newChild.className = "correct-part"
                    newChild.style.backgroundColor = "#66dd66"
                    newChild.style.borderRadius = "5px"
                    newChild.style.padding = "4px"
                    newChild.style.border = "3px solid #000000"
                    newChild.style.float = "right"
                    window.katex.render(correctChoiceText[i], newChild);
                    holderBox.appendChild(newChild);
                }
                var choices = isBWCheck.querySelectorAll("div.wac-input div.choice-wac-option");
                var counter = 0;
                var correctIndex;
                var foundSolution = false;
                for (let i = 0; i < choices.length; i++) {
                    if (choices[i].querySelector("img") === null) {
                        let answerBlocks = choices[i].querySelectorAll("span.answer-block")
                        //console.log(answerBlocks)
                        var answerBlockValues = []
                        for (let g = 0; g < answerBlocks.length; g++) {
                            answerBlockValues.push(answerBlocks[g].querySelector("span.katex-mathml annotation").textContent);
                        }
                        var success = correctChoiceText.every(function(val) {
                            return (answerBlockValues.indexOf(val) !== -1) || (answerBlockValues.indexOf("{"+val+"}") !== -1);
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
                if (foundSolution == true) {
                    choices[correctIndex].style = "background-color: #66dd66 !important;";
                } else{
                    console.log("You're probably looking here because the bookwork check answer was not highlighted. If you could send me the stuff logged that would be helpful");
                    console.log("The script will now log some things - the code for this bookwork check screen, and the list of bookwork checks with answers.");
                    console.log("For each of them, please right click, then click \"copy object\" (presuming you are on a Chrome-based browser).");
                    console.log("Then send them to me so I can fix it, either on Discord or Github Issues (https://github.com/Duoquadragesimal/useful-userscripts/issues).");
                    console.log(window.thisHWDict);
                    console.log(window.lastBWCheck);
                };
            };
            var homeworkPackages = document.querySelectorAll("div.package");
            for (let i = 0; i < homeworkPackages.length; i++) {
                let temp = homeworkPackages[i].querySelector(".package-title").textContent;
                if (homeworkPackages[i].querySelector("span.package-status.complete") !== null) {
                    window.localStorage.removeItem(temp)
                }
            }
        });
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);
}
main();
