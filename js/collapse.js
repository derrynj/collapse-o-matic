/*!
 * Collapse-O-Matic JavaSctipt v1.7.2
 * https://pluginoven.com/plugins/collapse-o-matic/
 *
 * Copyright 2022, Twinpictures
 */
'use strict';

function collapse_init() {
	//force collapse
	jQuery('.force_content_collapse').each(function(index) {
		jQuery(this).css('display', 'none');
	});

	//inital collapse
	jQuery('.collapseomatic:not(.colomat-close)').each(function(index) {
		const thisid = jQuery(this).attr('id');
		jQuery('#target-'+thisid).css('display', 'none');
	});

	//inital swaptitle for pre-expanded elements
	jQuery('.collapseomatic.colomat-close').each(function(index) {
		const thisid = jQuery(this).attr('id');
		if(jQuery("#swap-"+thisid).length > 0){
			swapTitle(this, "#swap-"+thisid );
		}
		if(jQuery("#swapexcerpt-"+thisid).length > 0){
			swapTitle("#excerpt-"+thisid, "#swapexcerpt-"+thisid);
		}
		jQuery('[id^=extra][id$='+thisid+']').each( function( index ){
			if(jQuery(this).data('swaptitle')){
				const old_swap_title = jQuery(this).data('swaptitle');
				const old_title = jQuery(this).html();
				jQuery(this).html(old_swap_title);
				jQuery(this).data('swaptitle', old_title);
			}
		});
	});
}

function swapTitle(origObj, swapObj){
	if(jQuery(origObj).prop("tagName") == 'IMG'){
		const origsrc = jQuery(origObj).prop('src');
		const swapsrc = jQuery(swapObj).prop('src');

		jQuery(origObj).prop('src',swapsrc);
		jQuery(swapObj).prop('src',origsrc);
	}
	else{
		const orightml = jQuery(origObj).html();
		const swaphtml = jQuery(swapObj).html();

		jQuery(origObj).html(swaphtml);
		jQuery(swapObj).html(orightml);
		if(jQuery(origObj).attr('title')){
			jQuery(origObj).attr('title',swaphtml);
			jQuery(swapObj).attr('title',orightml);
		}
	}
}

function toggleState (obj, id, maptastic, trig_id) {

	if (maptastic && jQuery('[id^=target][id$='+id+']').hasClass('maptastic') ) {
		jQuery('[id^=target][id$='+id+']').removeClass('maptastic');
	}

	//reset effect and duration to default
	let com_effect = com_options.colomatslideEffect;
	let com_duration = com_options.colomatduration;

	//effect override
	if( obj.attr('data-animation_effect') ){
		com_effect = obj.attr('data-animation_effect');
	}

	//duration override
	if( obj.attr('data-duration') ){
		com_duration = obj.attr('data-duration');
	}

	//if durration is a number, make it a number
	if( isFinite(com_duration) ){
		com_duration = parseFloat(com_duration);
	}

	//slideToggle
	if(com_effect == 'slideToggle'){
		//jQuery('[id^=target][id$='+id+']').slideToggle(com_duration, function() {
		jQuery('#target-'+id).slideToggle(com_duration, function() {
			// Animation complete.
			if( jQuery(this).hasClass('colomat-inline') && jQuery(this).is(':visible') ){
				jQuery(this).css('display', 'inline');
			}

			//deal with any findme links
			if(trig_id && jQuery('#'+trig_id).is('.find-me.colomat-close')){
				//offset_top = jQuery('#find-'+trig_id).attr('name');
				const findme = jQuery('#'+trig_id).attr('data-findme');
				let target_offset = jQuery('#'+trig_id).offset();

				if( findme == 'auto' || findme == 'target'){
					target_offset = jQuery('#target-'+trig_id).offset();
				}
				if( findme == 'trigger'){
					target_offset = jQuery('#'+trig_id).offset();
				}
				jQuery('html, body').animate({scrollTop:target_offset.top}, 500);
			}
		});
	}
	//slideFade
	else if(com_effect == 'slideFade'){
		jQuery('#target-'+id).animate({
			height: "toggle",
			opacity: "toggle"
		}, com_duration, function (){
			//Animation complete
			if( jQuery(this).hasClass('colomat-inline') && jQuery(this).is(':visible') ){
				jQuery(this).css('display', 'inline');
			}

			//deal with any findme links
			if(trig_id && jQuery('#'+trig_id).is('.find-me.colomat-close')){
				const findme = jQuery('#'+trig_id).attr('data-findme');
				let target_offset = jQuery('#'+trig_id).offset();

				if( findme == 'auto' || findme == 'target'){
					target_offset = jQuery('#target-'+trig_id).offset();
				}
				if( findme == 'trigger'){
					target_offset = jQuery('#'+trig_id).offset();
				}
				jQuery('html, body').animate({scrollTop:target_offset.top}, 500);
			}
		});
	}

	else if(com_effect == 'fadeOnly'){
		jQuery('#target-'+id).fadeToggle(com_duration, function() {
			//Animation complete
			if( jQuery(this).hasClass('colomat-inline') && jQuery(this).is(':visible') ){
				jQuery(this).css('display', 'inline');
			}

			//deal with any findme links
			if(trig_id && jQuery('#'+trig_id).is('.find-me.colomat-close')){
				const findme = jQuery('#'+trig_id).attr('data-findme');
				let target_offset = jQuery('#'+trig_id).offset();

				if( findme == 'auto' || findme == 'target'){
					target_offset = jQuery('#target-'+trig_id).offset();
				}
				if( findme == 'trigger'){
					target_offset = jQuery('#'+trig_id).offset();
				}
				jQuery('html, body').animate({scrollTop:target_offset.top}, 500);
			}
		});
	}

	//deal with google maps builder resize
	if(jQuery('#'+id).hasClass('colomat-close')){
		jQuery('.google-maps-builder').each(function(index) {
			const map = jQuery(".google-maps-builder")[index];
			google.maps.event.trigger(map, 'resize');
		});
	}

	//callback
	if ( typeof colomat_callback != 'undefined' ) {
		colomat_callback();
	}
}

function closeOtherGroups(rel){
	jQuery('.collapseomatic[rel!="' + rel +'"]').each(function(index) {
		//add close class if open
		if(jQuery(this).hasClass('colomat-expand-only') && jQuery(this).hasClass('colomat-close')){
			return;
		}
		if(jQuery(this).hasClass('colomat-close') && jQuery(this).attr('rel') !== undefined){
			jQuery(this).removeClass('colomat-close');
			const id = jQuery(this).attr('id');
			//remove parent highlight class
			jQuery('#parent-'+id).removeClass('colomat-parent-highlight');

			//check if the title needs to be swapped out
			if(jQuery("#swap-"+id).length > 0){
				swapTitle(this, "#swap-"+id);
			}

			//check if the excerpt needs to be swapped out
			if(jQuery("#swapexcerpt-"+id).length > 0){
				swapTitle("#exerpt-"+id, "#swapexcerpt-"+id);
			}

			//external triggers
			jQuery('[id^=extra][id$='+id+']').each( function( index ){
				if(jQuery(this).data('swaptitle')){
					const old_swap_title = jQuery(this).data('swaptitle');
					const old_title = jQuery(this).html();
					jQuery(this).html(old_swap_title);
					jQuery(this).data('swaptitle', old_title);
				}
			});

			toggleState (jQuery(this), id, false, false);

			//check if there are nested children that need to be collapsed
			const ancestors = jQuery('.collapseomatic', '#target-'+id);
			ancestors.each(function(index) {
				jQuery(this).removeClass('colomat-close');
				const thisid = jQuery(this).attr('id');
				jQuery('#target-'+thisid).css('display', 'none');
			})
		}
	});
}

function closeOtherRelMembers(rel, id){
	jQuery('.collapseomatic[rel="' + rel +'"]').each(function(index) {
		closeOtherMembers( this, id);
	});
}

function closeOtherTogMembers(togname, id){
	jQuery('.collapseomatic[data-togglegroup="' + togname +'"]').each(function(index) {
		closeOtherMembers( this, id);
	});
}

function closeOtherMembers(obj, id){
		if(jQuery(obj).hasClass('colomat-expand-only') && jQuery(obj).hasClass('colomat-close')){
			return;
		}

		//add close class if open
		if(jQuery(obj).attr('id') != id && jQuery(obj).hasClass('colomat-close')){
			//collapse the element
			jQuery(obj).removeClass('colomat-close');
			const thisid = jQuery(obj).attr('id');
			//remove parent highlight class
			jQuery('#parent-'+thisid).removeClass('colomat-parent-highlight');

			//check if the title needs to be swapped out
			if(jQuery("#swap-"+thisid).length > 0){
				swapTitle(obj, "#swap-"+thisid);
			}

			//check if the excerpt needs to be swapped out
			if(jQuery("#swapexcerpt-"+thisid).length > 0){
				swapTitle("#excerpt-"+thisid, "#swapexcerpt-"+thisid);
			}

			//external triggers
			jQuery('[id^=extra][id$='+thisid+']').each( function( index ){
				if(jQuery(this).data('swaptitle')){
					const old_swap_title = jQuery(this).data('swaptitle');
					const old_title = jQuery(this).html();
					jQuery(this).html(old_swap_title);
					jQuery(this).data('swaptitle', old_title);
				}
			});

			//check for snap-shut
			if(!jQuery(obj).hasClass('colomat-close') && jQuery(obj).hasClass('snap-shut')){
				jQuery('#target-'+thisid).hide();
			}
			else{
				toggleState (jQuery(obj), thisid, false, false);
			}

			//check if there are nested children that need to be collapsed
			const ancestors = jQuery('.collapseomatic', '#target-'+id);
			ancestors.each(function(index) {
				if(jQuery(this).hasClass('colomat-expand-only') && jQuery(this).hasClass('colomat-close')){
					return;
				}
				//deal with extra tirggers
				let pre_id = id.split('-');
				if (pre_id[0].indexOf('extra') != '-1') {
					//console.log('this is an extra trigger');
					const pre = pre_id.splice(0, 1);
					id = pre_id.join('-');

					//deal with any scroll to links from the Extra Collapse Trigger
					if(jQuery(this).hasClass('scroll-to-trigger')){
						const target_offset = jQuery('#'+id).offset();
						const offset_top = target_offset.top;
					}

					//deal with any scroll to links from the Title Trigger
					if(jQuery('#'+id).hasClass('scroll-to-trigger')){
						let offset_top = jQuery('#scrollonclose-'+id).attr('name');
						if (offset_top == 'auto') {
							const target_offset = jQuery('#'+id).offset();
							offset_top = target_offset.top;
						}
					}

					//toggle master trigger arrow
					jQuery('#'+id).toggleClass('colomat-close');

					//toggle any other extra trigger arrows
					jQuery('[id^=extra][id$='+id+']').toggleClass('colomat-close');
				}

				if(jQuery(this).attr('id').indexOf('bot-') == '-1'){
					jQuery(this).removeClass('colomat-close');
					const thisid = jQuery(this).attr('id');
					//check if the title needs to be swapped out
					if(jQuery("#swap-"+thisid).length > 0){
						swapTitle(this, "#swap-"+thisid);
					}
					//check if the excerpt needs to be swapped out
					if(jQuery("#swapexcerpt-"+thisid).length > 0){
						swapTitle("#excerpt-"+thisid, "#swapexcerpt-"+thisid);
					}
					//external triggers
					jQuery('[id^=extra][id$='+thisid+']').each( function( index ){
						if(jQuery(this).data('swaptitle')){
							const old_swap_title = jQuery(this).data('swaptitle');
							const old_title = jQuery(this).html();
							jQuery(this).html(old_swap_title);
							jQuery(this).data('swaptitle', old_title);
						}
					});
					jQuery('#target-'+thisid).css('display', 'none');
				}
			})
		}
}

function colomat_expandall(loop_items){
	if (!loop_items){
		loop_items = jQuery('.collapseomatic:not(.colomat-close)');
	}
	loop_items.each(function(index) {
		jQuery(this).addClass('colomat-close');
		const thisid = jQuery(this).attr('id');
		jQuery('#parent-'+thisid).addClass('colomat-parent-highlight');

		if(jQuery("#swap-"+thisid).length > 0){
			swapTitle(this, "#swap-"+thisid);
		}

		if(jQuery("#swapexcerpt-"+thisid).length > 0){
			swapTitle("#excerpt-"+thisid, "#swapexcerpt-"+thisid);
		}

		//external triggers
		jQuery('[id^=extra][id$='+thisid+']').each( function( index ){
			if(jQuery(this).data('swaptitle')){
				const old_swap_title = jQuery(this).data('swaptitle');
				const old_title = jQuery(this).html();
				jQuery(this).html(old_swap_title);
				jQuery(this).data('swaptitle', old_title);
			}
		});

		toggleState(jQuery(this), thisid, true, false);
	});
}

function colomat_collapseall(loop_items){
	if (!loop_items){
		loop_items = jQuery('.collapseomatic.colomat-close');
	}

	loop_items.each(function(index) {
		if(jQuery(this).hasClass('colomat-expand-only') && jQuery(this).hasClass('colomat-close')){
			return;
		}

		jQuery(this).removeClass('colomat-close');
		const thisid = jQuery(this).attr('id');
		jQuery('#parent-'+thisid).removeClass('colomat-parent-highlight');

		if(jQuery("#swap-"+thisid).length > 0){
			swapTitle(this, "#swap-"+thisid);
		}

		if(jQuery("#swapexcerpt-"+thisid).length > 0){
			swapTitle("#excerpt-"+thisid, "#swapexcerpt-"+thisid);
		}

		//external triggers
		jQuery('[id^=extra][id$='+thisid+']').each( function( index ){
			if(jQuery(this).data('swaptitle')){
				const old_swap_title = jQuery(this).data('swaptitle');
				const old_title = jQuery(this).html();
				jQuery(this).html(old_swap_title);
				jQuery(this).data('swaptitle', old_title);
			}
		});

		toggleState(jQuery(this), thisid, false, false);

	});
}


jQuery(function($) {
	let com_binding = 'click';
	if (com_options.colomattouchstart) {
		com_binding = 'click touchstart';
	}

	if (com_options.colomatpauseInit) {
		setTimeout(collapse_init, com_options.colomatpauseInit);
	}
	else{
		collapse_init();
	}

	//jetpack infinite scroll catch-all
	$( document.body ).on( 'post-load', function () {
		collapse_init();
	} );

	//Display the collapse wrapper... use to reverse the show-all on no JavaScript degredation.
	$('.content_collapse_wrapper').each(function(index) {
		$(this).css('display', 'inline');
	});

	//hover
	$(document).on({
		mouseenter: function(){
			//stuff to do on mouseover
			$(this).addClass('colomat-hover');
		},
		mouseleave: function(){
			//stuff to do on mouseleave
			$(this).removeClass('colomat-hover');
		},
		focusin: function(){
			//stuff to do on keyboard focus
			$(this).addClass('colomat-hover');
		},
		focusout: function(){
			//stuff to do on losing keyboard focus
			$(this).removeClass('colomat-hover');
		}
	}, '.collapseomatic'); //pass the element as an argument to .on

	//tabindex enter
	$(document).on('keypress','.collapseomatic', function(event) {
		if (event.which == 13) {
			event.currentTarget.click();
		};
	});

	//the main collapse/expand function
	$(document.body).on(com_binding, '.collapseomatic', function(event) {
		let offset_top;

		//alert('phones ringin dude');
		if($(this).hasClass('colomat-expand-only') && $(this).hasClass('colomat-close')){
			return;
		}

		// rel highlander must be one
		if($(this).attr('rel') && $(this).attr('rel').toString().indexOf('-highlander') != '-1' && $(this).hasClass('must-be-one') && $(this).hasClass('colomat-close')){
			return;
		}

		//toggle group highlander must be one
		if($(this).data('togglegroup') && $(this).data('togglegroup').toString().indexOf('-highlander') != '-1' && $(this).hasClass('must-be-one') && $(this).hasClass('colomat-close')){
			return;
		}

		let id = $(this).attr('id');

		//deal with any scroll to links
		if($(this).hasClass('colomat-close') && $(this).hasClass('scroll-to-trigger')){
			offset_top = $('#scrollonclose-'+id).attr('name');
			if (offset_top == 'auto') {
				const target_offset = $('#'+id).offset();
				offset_top = target_offset.top;
			}
		}

		const id_arr = id.split('-');

		//deal with extra tirggers
		if (id_arr[0].indexOf('extra') != '-1') {
			//console.log('this is an extra trigger');
			id_arr.splice(0, 1);
			id = id_arr.join('-');

			//deal with any scroll to links from the Extra Collapse Trigger
			if($(this).hasClass('scroll-to-trigger')){
				const target_offset = $('#'+id).offset();
				offset_top = target_offset.top;
			}

			//deal with any scroll to links from the Title Trigger
			if($('#'+id).hasClass('scroll-to-trigger')){
				offset_top = $('#scrollonclose-'+id).attr('name');
				if (offset_top == 'auto') {
					const target_offset = $('#'+id).offset();
					offset_top = target_offset.top;
				}
			}

			//toggle master trigger arrow
			$('#'+id).toggleClass('colomat-close');

			//toggle any other extra trigger arrows
			$('[id^=extra][id$='+id+']').toggleClass('colomat-close');
		}

		else if(id.indexOf('bot-') != '-1'){
			id = id.substr(4);
			$('#'+id).toggleClass('colomat-close');

			//deal with any scroll to links from the Internal Collapse Trigger
			if($(this).hasClass('scroll-to-trigger')){
				const target_offset = $('#'+id).offset();
				offset_top = target_offset.top;
			}

			//deal with any scroll to links from the Title Trigger
			if($('#'+id).hasClass('scroll-to-trigger')){
				offset_top = $('#scrollonclose-'+id).attr('name');
				if (offset_top == 'auto') {
					const target_offset = $('#'+id).offset();
					offset_top = target_offset.top;
				}
			}
		}
		else{
			$(this).toggleClass('colomat-close');
			//toggle any extra triggers
			$('[id^=extra][id$='+id+']').toggleClass('colomat-close');
		}

		//check if the title needs to be swapped out
		if($("#swap-"+id).length > 0){
			swapTitle($('#'+id), "#swap-"+id);
		}

		//check if the excerpt needs to be swapped out
		if($("#swapexcerpt-"+id).length > 0){
			swapTitle("#excerpt-"+id, "#swapexcerpt-"+id);
		}

		//external triggers
		$('[id^=extra][id$='+id+']').each( function( index ){
			if($(this).data('swaptitle')){
				const old_swap_title = $(this).data('swaptitle');
				const old_title = $(this).html();
				$(this).html(old_swap_title);
				$(this).data('swaptitle', old_title);
			}
		});

		//add visited class
		$(this).addClass('colomat-visited');

		//toggle parent highlight class
		const parentID = 'parent-'+id;
		$('#' + parentID).toggleClass('colomat-parent-highlight');

		//check for snap-shut
		if(!$(this).hasClass('colomat-close') && $(this).hasClass('snap-shut')){
			$('#target-'+id).hide();
		}
		else{
			toggleState ($(this), id, true, id);
		}

		//deal with grouped items if needed
		if($(this).attr('rel') !== undefined){
			const rel = $(this).attr('rel').toString();
			if(rel.indexOf('-highlander') != '-1'){
				closeOtherRelMembers(rel, id);
			}
			else{
				closeOtherGroups(rel);
			}
		}

		if($(this).data('togglegroup') !== undefined){
			const togname = $(this).data('togglegroup').toString();
			if(togname.indexOf('-highlander') != '-1'){
				closeOtherTogMembers(togname, id);
			}
		}

		if(offset_top){
			$('html, body').animate({scrollTop:offset_top}, 500);
		}
	});


	$(document).on(com_binding, '.expandall', function(event) {
		let loop_items;
		if($(this).attr('rel') !== undefined){
			const rel = $(this).attr('rel');
			loop_items = $('.collapseomatic:not(.colomat-close)[rel="' + rel +'"]');
		}
		else if($(this).attr('data-togglegroup') !== undefined){
			const toggroup = $(this).attr('data-togglegroup');
			loop_items = $('.collapseomatic:not(.colomat-close)[data-togglegroup="' + toggroup +'"]');
		}
		else{
			loop_items = $('.collapseomatic:not(.colomat-close)');
		}

		colomat_expandall(loop_items);
	});

	$(document).on(com_binding, '.collapseall', function(event) {
		let loop_items;
		if($(this).attr('rel') !== undefined){
			const rel = $(this).attr('rel');
			loop_items = $('.collapseomatic.colomat-close[rel="' + rel +'"]');
		}
		else if($(this).attr('data-togglegroup') !== undefined){
			const toggroup = $(this).attr('data-togglegroup');
			loop_items = $('.collapseomatic.colomat-close[data-togglegroup="' + toggroup +'"]');
		}
		else {
			loop_items = $('.collapseomatic.colomat-close');
		}

		colomat_collapseall(loop_items);
	});

	//handle new page loads with anchor
	let fullurl = document.location.toString();
	if (fullurl.match('#(?!\!)')) {
		hashmaster(fullurl);
	}

	//handle no-link triggers within the same page
	$(document).on('click', 'a.colomat-nolink', function(event) {
		event.preventDefault();
	});

	//manual hashtag changes in url
	$(window).on('hashchange', function (e) {
		fullurl = document.location.toString();
		if (fullurl.match('#(?!\!)')) {
			hashmaster(fullurl);
		}
	});

	//master url hash funciton
	function hashmaster(fullurl){
		// the URL contains an anchor but not a hash-bang
		if (fullurl.match('#(?!\!)')) {
			// click the navigation item corresponding to the anchor
			const anchor_arr = fullurl.split(/#(?!\!)/);
			let anchor;

			if(anchor_arr.length > 1){
				anchor_arr.splice(0, 1);
				anchor = anchor_arr.join('#');
			}
			else{
				anchor = anchor_arr[0];
			}

			if( $('#' + anchor).length ){
				//expand any nested parents
				$('#' + anchor).parents('.collapseomatic_content').each(function(index) {
					const parent_arr = $(this).attr('id').split('-');
					parent_arr.splice(0, 1);
					const parent = parent_arr.join('-');
					if(!$('#' + parent).hasClass('colomat-close')){
						$('#' + parent).trigger('click');
					}
				})
				//now expand the target anchor
				if(!$('#' + anchor).hasClass('colomat-close')){
					$('#' + anchor).trigger('click');
				}
			}

			if(typeof colomatoffset !== 'undefined'){
				const anchor_offset = $('#' + anchor).offset();
				const total_offset = colomatoffset + anchor_offset.top;
				$('html, body').animate({scrollTop:total_offset}, 50);
			}

		}
	}
});
