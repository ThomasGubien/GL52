$.noConflict();
let nbclicks=0;

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	} );

	jQuery('.selectpicker').selectpicker;


	$('#menuToggle').on('click', function(event) {
		$('body').toggleClass('open');
	});

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	// $('.user-area> a').on('click', function(event) {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	$('.user-menu').parent().removeClass('open');
	// 	$('.user-menu').parent().toggleClass('open');
	// });


});

function addAnswer(nbC) {
    console.log('Add Answer clicked')
    const div = document.createElement('div')

    div.className = 'answer'

    div.innerHTML =
        `<input type="text" name="answer${nbC}" value="" />\
        <label> <input type="checkbox" name="check${nbC}" value=${nbC} /> Correct Answer? </label>`

    document.getElementsByClassName('question')[nbC].appendChild(div);
  }   

  function addQuestion() {
    console.log('clicked')
    const div = document.createElement('div')

    div.className = 'question'

    div.innerHTML =
		`<label> Question </label>\
		<input type="text" name="question" value="" />\
		<input type="button" value="Add Answer" onclick="addAnswer(${nbclicks})">`

	document.getElementById('qcm').appendChild(div);
	nbclicks++
  }  