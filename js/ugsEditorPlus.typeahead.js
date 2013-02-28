// http://tatiyants.com/how-to-use-json-objects-with-twitter-bootstrap-typeahead/

var ugsEditorPlus = window.ugsEditorPlus || {};

ugsEditorPlus.typeahead = function(){

	// private
	// ---------------------------
	var _selectedValue = '';

	var _keysList = [];
	var _keysToDetailsDict = [];

	var _scrubbedQuery = '';
	var _regex;

	/**
	 * Scrapes HTML to build our list of
	 * keys, searchable text, and display text
	 * @return {[type]} [description]
	 */
	var listFromHtml = function(){

		$( 'li' ).each(function( index ) {
			var $this = $(this);

			var plainText = $this.text().replace(/\s\s+/g, ' ').trim();
			plainText = plainText.toLowerCase();

			var key = $this.children('a').attr('href');
			key = key.toLowerCase();

			var html = $this.children('a').html();
			html = html.replace('<strong class="', '<span class="bigger ').replace('</strong>', '</span>');

			_keysToDetailsDict[key] = {
				html : html,
				searchText : plainText,
				code : key
			};
			_keysList.push(key);
		});

	};

	var _ta_source = function (query, process) {
		_scrubbedQuery = this.query.trim().toLowerCase();
		_regex = new RegExp( '(' + this.query + ')', 'gi' );
		process(_keysList);
	};

	var _ta_updater = function (item) {
		_selectedValue = item;
		return item;
	};

	var _ta_matcher = function (item) {
		var detailed = _keysToDetailsDict[item];
		if (detailed.searchText.indexOf(_scrubbedQuery) != -1) {
			return true;
		}
	};

	var _ta_sorter = function (items) {
		return items.sort();
	};

	var _ta_highligher = function (item) {
		var $temp = $('<div/>').html(_keysToDetailsDict[item].html);

		$('em, .bigger', $temp).each(function( index ){
			var $ele = $(this);
			var text = $ele.html();
			$ele.html(text.replace( _regex, "<strong>$1</strong>" ))
		});
		return $temp.html();
	};

	return {

		initialize: function(){
			listFromHtml();

			$('#quickSearch')
				.typeahead({
					source: _ta_source,
					updater: _ta_updater,
					matcher: _ta_matcher,
					sorter: _ta_sorter,
					highlighter: _ta_highligher
				})
				.val('')
				.focus();
		},

		getSelected: function(){
			return _selectedValue;
		}
	};
};
