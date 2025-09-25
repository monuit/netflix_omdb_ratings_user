// ==UserScript==
// @name         Amazon Prime OMDB Ratings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show OMDB ratings on Amazon Prime
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.jp/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com.au/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Get API key from storage or prompt user
    let apiKey = GM_getValue('omdb_api_key');
    if (!apiKey) {
        apiKey = prompt('Please enter your OMDB API key (get from omdbapi.com):');
        if (apiKey) {
            GM_setValue('omdb_api_key', apiKey);
        } else {
            alert('OMDB API key is required for this script to work.');
            return;
        }
    }

    // Function to fetch rating from OMDB
    function fetchRating(title, callback) {
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&plot=short&r=json`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.Response === 'True') {
                        const rating = data.imdbRating;
                        if (rating && rating !== 'N/A') {
                            callback(rating);
                        } else {
                            callback(null);
                        }
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    callback(null);
                }
            },
            onerror: function() {
                callback(null);
            }
        });
    }

    // Function to add rating to an element
    function addRating(element, rating) {
        if (rating && !element.querySelector('.omdb-rating')) {
            const ratingSpan = document.createElement('span');
            ratingSpan.className = 'omdb-rating';
            ratingSpan.style.cssText = 'color: gold; font-weight: bold; margin-left: 5px;';
            ratingSpan.textContent = `⭐ ${rating}`;
            element.appendChild(ratingSpan);
        }
    }

    // Function to check if title is likely a movie/TV show
    function isValidTitle(title) {
        // Skip titles that are dates, sections, or contain certain keywords
        const invalidPatterns = [
            /^\d{1,2}\/\d{1,2}\/\d{4}$/, // Dates like MM/DD/YYYY
            /^\w+ \d{1,2}, \d{4}$/, // Month DD, YYYY
            /Explore All/i,
            /Continue Watching/i,
            /Today/i,
            /Because you watched/i,
            /Binge-worthy/i,
            /Watch for a While/i,
            /Critically-acclaimed/i,
            /New on/i,
            /Privacy/i,
            /Cookie/i,
            /General Description/i,
            /Essential Cookies/i,
            /Amazon Prime/i,
            /Watch Now/i,
            /More Like This/i
        ];
        return !invalidPatterns.some(pattern => pattern.test(title)) && title.length > 2 && title.length < 100;
    }

    // Function to clean title for better matching
    function cleanTitle(title) {
        // Remove parentheses and their contents, like (U.S.), (2025), etc.
        return title.replace(/\s*\([^)]*\)\s*/g, '').trim();
    }

    // Function to process titles
    function processTitles() {
        // Amazon Prime-specific selectors
        const selectors = [
            'h1[data-automation-id="title"]', // Main title
            'a[data-automation-id="title-link"]', // Title links
            '.av-hover-wrapper .av-play-title-text', // Hover titles
            '.av-grid-item .av-play-title-text', // Grid items
            '.av-browse-item .av-play-title-text', // Browse items
            '[data-testid="title"]', // Test IDs
            '.title-text', // Generic title class
            'h2 a[href*="title"]', // Links with title in href
            'a._3HZFFn', // Specific class from user example
            'h1', // Generic h1
            'h2', // Generic h2
            'h3'  // Generic h3
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.hasAttribute('data-omdb-processed')) {
                    element.setAttribute('data-omdb-processed', 'true');
                    const title = element.textContent.trim();
                    if (isValidTitle(title)) {
                        const clean = cleanTitle(title);
                        fetchRating(clean, rating => {
                            if (rating) {
                                addRating(element, rating);
                            }
                        });
                    }
                }
            });
        });
    }

    // Run on page load
    processTitles();

    // Observe for dynamic content changes
    const observer = new MutationObserver(processTitles);
    observer.observe(document.body, { childList: true, subtree: true });

})();