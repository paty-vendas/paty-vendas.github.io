<!--

waJSQuery(window).load(function () {
	initializeAllWA_search();
});

function initializeAllWA_search()
{
	//search
	waJSQuery(".wa-search-engine").each(function(i)
	{
		var _engine = waJSQuery(this);

		var _hackSearchBalise = false;

		if (isWebKit()==true)
		{
			_hackSearchBalise = true
		}

		if (_hackSearchBalise)
		{
			var _code = _engine.html();
			_code = _code.replace(/type="text"/gi,"type=\"search\"")
			_engine.html(_code)
		}

		var _but = _engine.find("button")
		var _input = _engine.find("input")

		_input.attr("results","0");
		_input.attr("placeholder","");


		if (isWindowsOS()&&((BrowserDetect.browser=="Chrome") || (BrowserDetect.browser=="Safari")))
		{
			var _h = _input.height();
			_h = Math.max(_h,22)
			_input.css({"height":""+_h+"px"})
		}

		var _yInput = (_engine.height()-_input.outerHeight())/2
		_input.css("top",_yInput)
		//alert(_yInput)

		_input.keypress(function(e) {
			if (e.which=='13')
			{
				_WA_launchSearch(_input)
			}

		});
		var _lnk = _but.parent();
		_lnk.css("cursor","pointer")
		_but.css("cursor","pointer")

		_lnk.click(function()
		{
		//	alert('search')
			_WA_launchSearch(_input)
			////
		});

		if (_hackSearchBalise)
		{
			waActivateOverButton(_lnk)
		}
		//

	});


	//waActivateOverButtons()
}

function WA_declareSearchIndex(_search_index_js)
{
	document.const_wa_search_index_js=_search_index_js
}

function _stringIsEmpty( str ) {
	return waJSQuery.trim( str ).length === 0;
}

////
function _WA_launchSearch(_input)
{
	WA_openSearchDialog(_input,document.const_wa_search_index_js)
}


function _WA_SearchIndexLoaded(_params)
{
	document.wa_search_index_js_loaded = true;
	var _w=_params[0]

	_WA_SearchInitialisation();
	_w._loading_index_in_progress=false;
	_w._onSearch()
}

function WA_onClickSearch()
{
	var _w=WA_Dialog.getCurrent()
	if (!_w)return;
	if (_w._loading_index_in_progress==true) return;

	_w._currentFilter = waJSQuery("#"+_w._name_select_filter+" ").val()
	_w._onSearch()
}

function _WA_formatSearchQuery(_input)
{


	var _globalVar = window.CONST_WA_SEARCH_INDEX2

	if ( !_globalVar ) {
		return
	}



	var _input_value = _input.val()


	var _search_string = _input_value;

	//alert(_input_value)
	_search_string = removeAccentsFromString(_search_string);
	_search_string = waJSQuery.trim(_search_string);
	var _list_separator=[",",";","\\.","'",":","/","`","\\?"];
	for (var c = 0;c < _list_separator.length;c++)
	{
		var reg=new RegExp(_list_separator[c], "g");
		_search_string = _search_string.replace(reg," ")
	}


	var _list_search0 = _search_string.toLowerCase().split(" ");
	var _list_search2 = new Array();
	for (var i=0;i<_list_search0.length;i++)
	{
		var w = waJSQuery.trim(_list_search0[i]);

		if ( typeof( w ) != 'undefined' )
		{

			var _number = Number(w);
			if (isNaN(_number))
			{
				if (w.length >= _globalVar.min_lenght_word) _list_search2.push(w);
			}
			else
			{
				if (w.length >= _globalVar.min_lenght_number) _list_search2.push(w);
			}

		}
	}
	_list_search2 = _list_search2.sort(_WA_sort_fct_string_by_length);





	var _list_search = new Array()
	for (var i=0;i<_list_search2.length;i++)
	{
		var w = _list_search2[i];
		/*
		\u65e5

		&#26085;&#20175;&#36766;
		*/
		var _w2 = ""
		for (var i2 = 0;i2<w.length;i2++)
		{
			var _code = w.charCodeAt(i2);

			if (((_code>125)&&(_code<255))||(_code == 38)||(_code == '<')||(_code == '>')||(_code=='"'))
			{
				//_w2+="&#"+_code+";" // a revoir
			}
			else
			{
				_w2+=w.charAt(i2);
			}


		}
	//	alert(_w2)
		_list_search.push(_w2);
	}

	var _list_search_for_formating = new Array();
 	for (var i=0;i<_list_search.length;i++)
	{
		var _w = _list_search[i];
		var _b_valid = true;
		for (var i2=i+1;i2<_list_search.length;i2++)
    	{
    		var _w2 = _list_search[i2];
    		if (_w2.indexOf(_w)>-1)
    		{
    			_b_valid = false;
    			break;
    		}
    	}
    	if (_b_valid) _list_search_for_formating.push(_w);
	}
	return _list_search_for_formating;
}


function WA_openSearchDialog(_input,_search_index_js)
{


	var _w = new WA_Dialog();
	_w._field_input=_input
	_w._lyImage = 40;
	_w._currentFilter="-1"

	_w._displaySearchWindows=function(_input_value)
	{
		//
		this._name_input='search-dialog-input'
		this._name_select_filter='search-dialog-select-filter'
		this._name_windows_title_result="wa-result-windows-title"
		this._name_windows_result="wa-result-windows"

		var _bgTitleColor = "rgba(0,0,0,0.5)"

		var _css_label="font-weight:bold;font-size:12px;"
		this.initializeWindow(600,500)

		var _s =""
		_s+="<table border=0 cellpadding=0 cellspacing=0  style='width:100%;'>";
		_s+="<tr><td align=left style='"+_css_label+"'>"
		_s+="<input type=text results=0 placeholder='' id='"+this._name_input+"' >&nbsp;&nbsp;"
		_s+="<input type=button value='"+Translator.tr("Search")+"' onclick='WA_onClickSearch()'>"
		_s+="&nbsp;&nbsp;"

		//		alert('display '+window.CONST_WA_SEARCH_INDEX2)
		_s+="<span id='search-filter-select' ></span>"

		_s+="<br><br>"
		_s+="</td>"
		_s+="</tr>";
		_s+="</table>"

		_s+="<div id='"+this._name_windows_title_result+"' style='"
		_s+="font-family:Arial;color:#ffffff;font-weight:bold;text-align:right;font-size:13px;";
		_s+="height:20px;line-height:20px;width:100%;"
		_s+="' ></div>"

		_s+="<div id='"+this._name_windows_result+"' style='";

		_s+="position:relative;overflow:auto;"
		_s+="border-style:solid;border-width:1px;border-color:"+_bgTitleColor+";"
		_s+="background-color:#ffffff;width:10px;height:10px;'></div>"
		this.writeContent(_s)

		waJSQuery("#"+this._name_windows_title_result).css({"backgroundColor":"#000000","opacity":0.5})

		//this._updateFilterSelect()
		this.customUpdate()
		waJSQuery("#"+this._name_input).val(_input_value)
	}


		_w._formatStringWithQuery = function(s)
		{
			var _list_search = this._list_query
			var title_ref =s;
			var title2 = removeAccentsFromString(title_ref.toLowerCase());

			var result =title_ref;
			var result2 =title2;

	    	for (var i=0;i<_list_search.length;i++)
	    	{
	    		var w = waJSQuery.trim(_list_search[i]);
	//alert("formatStringWithQuery "+s+" "+w)
	    		var len_w = w.length;
	    		if (len_w>1)
	    		{
	    			var nb = 0;
		     		var ind0 = 0;
		     		var ind_search = 0;
		    		var ind = 0;
		    		do
		    		{
			     		ind = result2.indexOf(w,ind_search);
			    		if (ind>-1)
			    		{
			    			var index_1 = ind+len_w;

			    			var s0 = result.substring(ind0,ind);
			    			var sw = result.substring(ind,ind+len_w);
			    			var s1 = result.substring(index_1);

			    			var s2_0 = result2.substring(ind0,ind);
			    			var s2_1 = result2.substring(index_1);

			    			result = s0+"<b>"+sw+"</b>"+s1;
			    			result2 = s2_0+"<b>"+w+"</b>"+s2_1;
			    			ind_search=index_1+7;
			    		}
			    		nb++;

		    		}
		    		while (ind>0);
	    		}
	    	}
			//alert(result)
			return result;
		}


	_w._updateFilterSelect=function(_params)
	{
		var _selectDiv = waJSQuery("#search-filter-select")

		var _globalVar = window.CONST_WA_SEARCH_INDEX2


		var _nbChoices = 0;
		if (_params.hasPagesIndex==true) _nbChoices++;
		if (_params.hasMarketItemIndex==true) _nbChoices++;
		if (_params.hasImagesIndex==true) _nbChoices++;
		if (_params.hasPrestashopIndex==true) _nbChoices++;

		if (_nbChoices<=1)
		{
			_selectDiv.html("")
			return;
		}

		//var _filter = waJSQuery("#"+this._name_select_filter+" ").val()


		_selectDiv.data("initialized",true)
		var _s=""


		_s+="<select id='"+this._name_select_filter+"' onchange='WA_onClickSearch()'>"
		_s+="<option value='-1' "+((this._currentFilter=="-1")?"selected":"")+">"+Translator.tr("All results")+"</option>"
		if (_params.hasPagesIndex==true)
		{
			_s+="<option value='0'"+((this._currentFilter=="0")?"selected":"")+">"+Translator.tr("Pages results")+"</option>"
		}
		if (_params.hasImagesIndex==true)
		{
			_s+="<option value='2'"+((this._currentFilter=="2")?"selected":"")+">"+Translator.tr("Photos results")+"</option>"
		}
		if (_params.hasMarketItemIndex==true)
		{
			_s+="<option value='1'"+((this._currentFilter=="1")?"selected":"")+">"+Translator.tr("Articles results")+"</option>"
		}
		if (_params.hasPrestashopIndex==true)
		{
			_s+="<option value='3'"+((this._currentFilter=="3")?"selected":"")+">"+Translator.tr("PrestaShop results")+"</option>"
		}

		_s+="</select>"
		_selectDiv.html(_s)
	}



	_w._setResultTitle=function(_s)
	{
		waJSQuery("#"+this._name_windows_title_result).html(_s+"&nbsp;")
	}

	_w.closeWin=function()
	{
		this._field_input.focus()
		this.intern_closeWin()
	}

	_w.onCustomKeypress=function(_k)
	{

		if (_k==13)
		{
			this._onSearch()
			return true;
		}
		/*
		if (_k!=27)
		{
			this._setResult("")
			this._setResultTitle("");//Translator.tr("No results"))
		}
		*/
	//	alert(_k)
		return false;
	}

	_w.customUpdate=function()
	{
	//	alert("customUpdate"+this._widthSearchResult())
		waJSQuery("#"+this._name_windows_result).css({width:this.m_content_lx-2,height:this.m_content_ly-63})
	}
	_w._setResult=function(_s)
	{
		waJSQuery("#"+this._name_windows_result).html(_s)
	}


	_w._buildItemResultHTML=function(_n,_title,_desc,_url,_htmlImage,_scoring)
	{
		var _shart_url = _url;
		var _pos = _url.indexOf( 'prestashop_' );

		if ( _pos != -1 ) {
			_shart_url = _url.substr( _pos );
		}

		if (_title.length==0)
		{
			_title="Untitled"
		}
		else
		{
			_title = this._formatStringWithQuery(_title)
		}
		var _css_search_result_title="color:#212121;text-decoration:underline;font-size:15px;";
		var _css_search_result_description="color:#000000;font-size:13px;";
		var _css_search_result_url="color:#999999;font-size:13px;";
		var _css_search_result_annex_url="color:#990099;font-size:12px;";
		var _s=""
		_s +="<table border=0 width=100% cellspacing=0 cellpadding=0>"
		_s +="<tr>"
		if (_htmlImage.length>0)
		{
			//alert(this._lyImage)
			_s +="<td align=center valign=top width="+this._lyImage+"px style=''>"
			_s += _htmlImage

			_s +="</td>"
		}
		_s +="<td"
		if (_htmlImage.length==0)
		{
			_s +="colspan=2"
		}
		_s +=">"
		_s+=   "<a style='"+_css_search_result_title+"' href='"+_url+"'>"+_title+"</a>";
		_s+="<br>";
		if (_desc.length>0)
		{
			_s+="<span style='"+_css_search_result_description+"'>"+this._formatStringWithQuery(_desc)+"</span><br>";
		}
		_s+="<a style='"+_css_search_result_url+"' href='"+_url+"'>"+_shart_url +"</a>";
		_s +="</td>"


		_s +="</tr>"
		_s +="</table >";

		return _s;
	}

	_w._loadItemMarketResult=function(_objResult,_pageInfos,_urlInfo,_idMarket,_item,i,_scoring)
	{
	//	alert("_loadItemMarketResult")
		var _root = this
		waJSQuery.getJSON(_urlInfo ,{}, function(_json)
		{
			var _it = _json.products[i]
			var _url = _pageInfos.url+"?wa_key="+"wa_"+_objResult.info.p+"/market_"+_objResult.info.id
			var _htmlImage =""
			var _ly = _root._lyImage;



			if (_it.img_thumb.length>0)
			{
				var _size = new Size(_it.size_thumb[0],_it.size_thumb[1]);
				_size.scale(new Size(_ly,_ly),true)

				_htmlImage="<img src=\""+_it.img_thumb+"\" width=\""+_size.width()+"px\" height=\""+_size.height()+"px\" border=0 style='margin-right:10px;'>"
			}

			var _html = _root._buildItemResultHTML(i,_it.title,_it.sub_title,_url,_htmlImage,_scoring)
			_item.html(_html)
		});
	}

	_w._loadItemPhotoResult=function(_objResult,_pageInfos,_urlInfo,_idFolder,_item,i,_scoring)
	{
	//	alert("_loadItemPhotoResult")
		var _root = this
		waJSQuery.getJSON(_urlInfo ,{}, function(_json)
		{
			var _it = _json.images[i]
			var _htmlImage =""
			var _ly = _root._lyImage;

				var _sizeMax = new Size(_ly,_ly)
				var _size = null
				var _galType = _json.global_config.gallery_type
				var _prefixe="th_"
				if (_galType==0)
				{
					_size = _sizeMax
				}
				if ((_galType==1)&&(_json.global_config.open_popup_when_clicking==1))
				{
					_prefixe="big_"
					_size = new Size(_it.size.w,_it.size.h);
					_size.scale(_sizeMax,true)

				}

				_htmlImage="<img src=\""+_idFolder+"/"+_prefixe+_it.fn+"\" width=\""+_size.width()+"px\" height=\""+_size.height()+"px\" border=0 style='margin-right:10px;'>"



			var _url = _pageInfos.url+"?wa_key="+"wa_"+_objResult.info.p+"/pa_"+_objResult.info.id
			var _html = _root._buildItemResultHTML(i,_it.comment,"",_url,_htmlImage,_scoring)
			_item.html(_html)
		});
	}

	_w._onSearch=function() {
		if ( typeof( prestaBase ) == 'undefined' || _stringIsEmpty( prestaBase ) ) {
			_w._onSearchTerminated( null );
		}
		else {
			var _input = waJSQuery( '#' +this._name_input );
			var _list_query = _WA_formatSearchQuery( _input );
			var _url = prestaBase +'/wa/?service=info&lang=' +Translator.m_lang +'&q=products&exp=' +_list_query +'&pn=1&ps=1000';
			var _context = this;

			_w._setResultTitle( 'Loading search index...' );
			_w._setResult( '<div align=center style="padding:20px;">' +htmlDynamicLoader( true, 100, 100 ) +'</div>' );
			waActivateDynamicLoader( waJSQuery( '#' +_w._name_windows_result ), true );

			waJSQuery.getJSON( _url, {}, function( _json ) {
				_w._onSearchTerminated( _json );
			});
		}
	}

	_w._onSearchTerminated=function(_prestashopResults)
	{
		var _globalVar = window.CONST_WA_SEARCH_INDEX2;

		if ( typeof( _globalVar ) == 'undefined' ) {
			return;
		}


		var _m_array_page_infos = _globalVar.page_info;
		var _filter = this._currentFilter;

		if ( typeof( _filter ) == 'undefined' ) {
			_filter = '';
		}

		var _input = waJSQuery("#"+this._name_input)

		this._field_input.val(_input.val())

	//	alert(_input.length)
		var _list_query = _WA_formatSearchQuery(_input)
		this._list_query = _list_query;


	//	alert("_onSearch "+_filter)
		var _paramsChoices = {}
		var _list_final_results = _WA_onSearchInIndex(_list_query,_filter,_paramsChoices,_prestashopResults)

		if ( typeof( _list_final_results ) == 'undefined' ) return;

		var _s=""
		var _css_common="font-family:Arial;";

		var _css_search_result_title="color:#212121;text-decoration:underline;font-size:15px;";
		var _css_search_result_description="color:#000000;font-size:13px;";
		var _css_search_result_url="color:#999999;font-size:13px;";
		var _css_search_result_annex_url="color:#990099;font-size:12px;";

		var l_image=40;//35;
		for (var i = 0;i<_list_final_results.length;i++)
		{
			var _objFinalResult = _list_final_results[i]
			var _objSearchResult = _objFinalResult._objSearchResult;
			var _objResult = _objSearchResult.objResult;

			var _pageInfos = _m_array_page_infos[_objResult.p];//_obj.page_info

			if ( typeof( _pageInfos ) == 'undefined' ) {
				_pageInfos = {
					title: '',
					desc: '',
					url: ''
				};
			}

			var _title = _pageInfos.title
			var desc =_pageInfos.desc
			var url = _pageInfos.url

			if ( typeof( _title ) == 'undefined' ) _title=""
			if ( typeof( desc ) == 'undefined' ) desc=""
			if ( typeof( url ) == 'undefined' ) url=""

			if (_objResult.typ==0)
			{
			//	_hasPagesIndex = true;
			}

			if (_objResult.typ==1)
			{
				desc="market "+_pageInfos.info
				url="market?item="+_pageInfos.info
			//	_hasMarketItemIndex = true;
			}
			if (_objResult.typ==2)
			{
				desc="img "+_pageInfos.info
			//	_hasImagesIndex = true;
			}
			if (_objResult.typ==3)
			{
				url = _objResult.info.link;
				_title = _objResult.info.name;
				desc = '';
			//	hasPrestashopIndex = true;
			}

			var _formatedDescription = desc ;//+" "+_obj._descriptionFormatedWithQuery(_list_query)

			//alert(_objResult.typ)

			var _bgColor=""
			if (i%2==0)
			{
				_bgColor="background-color:#f3f3f3;"
			}

			_s+="<div id='search_item-"+i+"' style='padding:5px;"+_bgColor+"'>"

			if (_objResult.typ==0)
			{
				if (_title.length==0)
				{
					_title = url;
				}
				_s+= this._buildItemResultHTML(i,_title,_formatedDescription,url,"",_objSearchResult.scoring)
			}
			else if ( _objResult.typ == 3 ) {
				_htmlImage = '<img src="' +_objResult.info.image +'" width="45px" height="45px" border=0 style="margin-right:10px;">';
				_s += this._buildItemResultHTML( i, _title, desc, url, _htmlImage, _objSearchResult.scoring );
			}
			else
			{
				_s+="item "+_pageInfos.info;
			}

			_s+="</div>"

		}

		///

		this._setResult(_s)

		////

		if (_list_final_results.length==0)
		{
			if ((this._list_query.length==0)&&(_input.val().length>0))
			{
				this._setResultTitle(Translator.tr("Type words with more characters"))
			}
			else
			{
				this._setResultTitle(Translator.tr("No results"))
			}


			//

		}
		else
		{
			this._setResultTitle(Translator.tr("Search result")+" : "+_list_final_results.length)
		}



		if (_list_final_results.length>0)
		{
			var _win = waJSQuery("#"+this._name_windows_result)
			//enhance results
			for (var i = 0;i<_list_final_results.length;i++)
			{
				var _objFinalResult = _list_final_results[i]
				// .page_reference
				var _objSearchResult = _objFinalResult._objSearchResult;

				var objResult = _objSearchResult.objResult;


				var _objInfo = objResult.info

				//	alert(_objInfo)
				var _pageInfos = _globalVar.page_info[objResult.p]
				if (objResult.typ!=0)
				{
					var _item = _win.find("#search_item-"+i)

					var _info = _objInfo.id
					var _nItem = -1;
					var _n1 = typeof( _info ) == 'undefined' ? -1 : _info.lastIndexOf("-");
					if (_n1>-1)
					{
						_nItem = parseInt(_info.substring(_n1+1))
						_info = _info.substring(0,_n1)
					}
					var _extlang = Translator.m_lang_for_filename;
					if (_extlang.length>0)
					{
						_extlang = "_"+_extlang
					}
				//	alert(_extlang)
					if (objResult.typ == 1)
					{
						var _urlInfo = "wa_"+_objInfo.p+"/market_"+_info+"/";

						_urlInfo += "market-definition"+_extlang+".js";

						var _idMarket = "wa_"+_objInfo.p+"/market_"+_info
						this._loadItemMarketResult(objResult,_pageInfos,_urlInfo,_idMarket,_item,_nItem,_objSearchResult.scoring)
					}

					if (objResult.typ == 2)
					{
						var _urlInfo = "wa_"+_objInfo.p+"/pa_"+_info+"/";
						_urlInfo += "photo-album-definition"+_extlang+".js";

						//alert(_urlInfo)
						var _idFolder = "wa_"+_objInfo.p+"/pa_"+_info
						this._loadItemPhotoResult(objResult,_pageInfos,_urlInfo,_idFolder,_item,_nItem,_objSearchResult.scoring)
					}
				}
			}
		}


		this._updateFilterSelect(_paramsChoices);


		_input.focus()
	}

	_w._displaySearchWindows(_input.val())

	if (document.wa_search_index_js_loaded == true)
	{
		_w._onSearch()
	}
	else
	{
		_w._loading_index_in_progress=true;
		_w._setResultTitle("Loading search index...")

		_w._setResult("<div align=center style='padding:20px;'>"+htmlDynamicLoader(true,100,100)+"</div>")

		WA_loadScript(_search_index_js,_WA_SearchIndexLoaded,[_w])
	}

	waActivateDynamicLoader(waJSQuery("#"+_w._name_windows_result),true)

}


function _WA_onSearchInIndex(_list_query,_filter,_paramChoices,_prestashopResults)
{
	if ( typeof( window.CONST_WA_SEARCH_INDEX2 ) == 'undefined' ) return

	// this is a deep copy - aka original window.CONST_WA_SEARCH_INDEX2 will not be modified if we modify this object
	var _globalVar = jQuery.extend(true, {}, window.CONST_WA_SEARCH_INDEX2);
	var _hasPrestashopIndex = false;

	// add shop results into the deep copy so we don't need to modifiy much the current code
	var _hasPS = ( typeof( _prestashopResults ) != 'undefined' ) && ( _prestashopResults != null );
	_hasPS = _hasPS && ( typeof( _prestashopResults.data ) != 'undefined' ) && ( _prestashopResults.data != null );

	if ( _hasPS ) {
		if ( typeof( _globalVar.result_items ) == 'undefined' ) {
			_globalVar.result_items = new Object();
		}

		if ( typeof( _globalVar.index ) == 'undefined' ) {
			_globalVar.index = new Object();
		}

		for ( var i = 0; i < _prestashopResults.data.length; i++ ) {
			var _item = _prestashopResults.data[ i ];
			var _resultItem = {
				typ: 3,
				p: -1,
				info: {
					image: _item.imgURL,
					name: _item.name,
					link: _item.link
				}
			};

			_globalVar.result_items.push( _resultItem );

			for ( var j = 0; j < _list_query.length; j++ ) {
				var _list_item = _list_query[ j ];

				if ( typeof( _globalVar.index[ _list_item ] ) == 'undefined' ) {
					_globalVar.index[ _list_item ] = new Array();
				}

				var _resultIndex = [
					_globalVar.result_items.length -1,
					1
				];

				_globalVar.index[ _list_item ].unshift( _resultIndex );
				_hasPrestashopIndex = true;
			}
		}
	}

	_globalVar.has_prestashop_index = _hasPrestashopIndex;

	var _hasPagesIndex = false;
	var _hasImagesIndex = false;
	var _hasMarketItemIndex = false;

	//alert(_list_query+"  "+_filter)
	var _list_result2 = false;
	var _list_result = new Array()
	//alert("_filter="+_filter)
	var nDebug = 0;
	var _m_array_index=_globalVar.index
	var _m_array_result_items=_globalVar.result_items
	var _m_array_page_infos=_globalVar.page_info
	//
	var _list_search = _list_query

	for (var i=0;i<_list_search.length;i++)
	{
		var w = _list_search[i];

		if (w.length>0)
		{
			_list_result = new Array();

     		for (var index in _m_array_index)
	    	{
	    		var _ind_match_search = index.indexOf(w) ;

	    		if (_ind_match_search!= -1)
	    		{
	    			var list_refs = _m_array_index[index];
	    			//match !

		    		for (var _index_result in list_refs)
			    	{
			    		var _refResult = list_refs[_index_result];  // _refResult  == [6,1]
						var _indexItemResult = _refResult[0] //index item result
						var _scoring= _refResult[1]
						//scoring ponderation
						/*
						_ind_match_search==0 //commence par la clé  score = 1
						_ind_match_search>0 //contient clé  score = 0.5
						index ==  w //cexact match  score = 1.5
						*/
						//

						var _objResult = _m_array_result_items[_indexItemResult];
						var _bMatch = false;

						if ((_filter=="-1")||(_filter=="")) _bMatch= true;
						if (_filter=="0") _bMatch= (_objResult.typ==0);
						if (_filter=="1") _bMatch= (_objResult.typ==1);
						if (_filter=="2") _bMatch= (_objResult.typ==2);
						if (_filter=="3") _bMatch= (_objResult.typ==3);

						if  (_objResult.typ==0) _paramChoices.hasPagesIndex = true;
						if  (_objResult.typ==1) _paramChoices.hasMarketItemIndex = true;
						if  (_objResult.typ==2) _paramChoices.hasImagesIndex = true;
						if  (_objResult.typ==3) _paramChoices.hasPrestashopIndex = true;

				//alert(_filter)
						/*
						if (nDebug<4)
						{
							alert(_filter+"  "+_objResult.typ)
							nDebug++;
						}
						*/
						if (_bMatch)
						{
							var _objSearchResult = _list_result[_indexItemResult];

							if ( typeof( _objSearchResult ) == 'undefined' )
				    		{
				    			_list_result[_indexItemResult] = new Object();
				    			_objSearchResult = _list_result[_indexItemResult];
								_objSearchResult.scoring = 0;
								_objSearchResult.objResult = _objResult;
				    		}
							_objSearchResult.scoring+=_scoring;
						}

			    	}
	    		}
	    	}

	    	if (_list_result2)
	    	{
	    		var _list_result3 = new Array();

	     		for (var index in _list_result)
		    	{
		     		for (var index2 in _list_result2)
			    	{
			    		if (index2==index)
			    		{
			    			_list_result3[index] = _list_result[index];
			    			break;
			    		}
			    	}
		    	}
		    	_list_result = _list_result3;
	    	}

	    	_list_result2 = _list_result;
		}

    	////
	}
	///////////

	var _list_final_result = new Array();

/////
	var _nb_result=0;
	for (var _indexSearchResult in _list_result)
	{
		var _objSearchResult = _list_result[_indexSearchResult]
		//alert("result="+_infoPage)
		var _object_final_result = new Array();
		// .page_reference
		_object_final_result._objSearchResult = _objSearchResult;
		_object_final_result.index_page=_indexSearchResult;
		_object_final_result.scoring=0;

		//_objSearchResult.objResult
		//_ref_score + _info._getAdditionalScore(_list_search);
		_object_final_result.test_index=_nb_result;

		_list_final_result.push(_object_final_result);
		_nb_result++;


	}
	////
	_list_final_result = _list_final_result.sort(_WA_sort_fct_scoring);

//	alert(_list_final_result.length)

	return _list_final_result;
}


/////////////////


function _WA_SearchInitialisation()
{
}


/////////////////////////////////
/*
function _SearchResultPageInfo()
{
	this.m_ref="";
	this.m_img=""
	this._filterAttributes = function (_s)
	{
		if ( typeof( _s ) == 'undefined' ) return""
		return _s
	}
	this.parseAttributes = function (_page_info)
	{
		this.m_lang = _page_info.lng;
		this.m_url = _page_info.url;

		this.m_title = this._filterAttributes(_page_info.title);
		this.m_title2 = this._filterAttributes(_page_info.title2);

		this.m_description = this._filterAttributes(_page_info.desc);
		this.m_description2 = this._filterAttributes(_page_info.desc2);

		this.m_keywords = this._filterAttributes(_page_info.k);

		this.m_img = this._filterAttributes(_page_info.img);
		var img_size = _page_info.img_size;
		if (!img_size)img_size=""
		this.m_type = parseInt(_page_info.type)
		if (isNaN(this.m_type))
		{
			this.m_type = 0;
		}
		if (img_size.length>0)
		{
			var list_size = img_size.split(",");
			if (list_size.length==2)
			{
				this.m_img_lx=parseInt(list_size[0])
				this.m_img_ly=parseInt(list_size[1])
			}
		}
	}
	///
	this._getAdditionalScore =function(_list_search)
	{
		var res = 0;
    	for (var i=0;i<_list_search.length;i++)
    	{
    		var w = _list_search[i];
    		if (w.length>1)
    		{
    			res+=25 * _SearchResultPageInfo._computeScore(w,this.m_title2);
    			res+=15 * _SearchResultPageInfo._computeScore(w,this.m_description2);
    			res+=30 * _SearchResultPageInfo._computeScore(w,this.m_keywords);
    		}
    	}
		return res;
	}

	this.url=function(lng)
	{
		if (this.m_lang=="all")
		{
			if (lng.length==0)
			{
				return this.m_url.replace(/@lng@/g,"")
				//return StringUtils.replace(this.m_url,"@lng@","")
			}
			else
			{
				//return StringUtils.replace(this.m_url,"@lng@","_"+lng)
				return this.m_url.replace(/@lng@/g,"_"+lng)
			}

		}
		return this.m_url;
	}


	this.formatStringWithQuery = function(s,_list_search)
	{

		var title_ref =s;
		var title2 = removeAccentsFromString(title_ref.toLowerCase());

		var result =title_ref;
		var result2 =title2;

    	for (var i=0;i<_list_search.length;i++)
    	{
    		var w = waJSQuery.trim(_list_search[i]);
//alert("formatStringWithQuery "+s+" "+w)
    		var len_w = w.length;
    		if (len_w>1)
    		{
    			var nb = 0;
	     		var ind0 = 0;
	     		var ind_search = 0;
	    		var ind = 0;
	    		do
	    		{
		     		ind = result2.indexOf(w,ind_search);
		    		if (ind>-1)
		    		{
		    			var index_1 = ind+len_w;

		    			var s0 = result.substring(ind0,ind);
		    			var sw = result.substring(ind,ind+len_w);
		    			var s1 = result.substring(index_1);

		    			var s2_0 = result2.substring(ind0,ind);
		    			var s2_1 = result2.substring(index_1);

		    			result = s0+"<b>"+sw+"</b>"+s1;
		    			result2 = s2_0+"<b>"+w+"</b>"+s2_1;
		    			ind_search=index_1+7;
		    		}
		    		nb++;

	    		}
	    		while (ind>0);
    		}
    	}
		//alert(result)
		return result;
	}

	this.title=function()
	{
		var title =this.m_title;
		if (title.length==0)
		{
			title = "Page "+this.m_ref+" (no title !)";
		}
		return title;
	}
	this._titleFormatedWithQuery=function(_list_search)
	{
		return this.formatStringWithQuery(this.title(),_list_search);
	}
	this._descriptionFormatedWithQuery=function (_list_search)
	{
		return this.formatStringWithQuery(this.m_description,_list_search);
	}


}


_SearchResultPageInfo._computeScore=function(_query_w,match_w)
{
	var _score = 0;
	if (_query_w==match_w)
	{
		_score=6.2;
	}
	else
	{
		var ind = match_w.indexOf(_query_w);
		if (ind==0)
		{
			_score=5;
		}
		else
		if (ind>0)
		{
			_score=1;
		}
	}
//	_score+=0.2
	return _score;
}
*/

 function _WA_sort_fct_string_by_length(a, b)
 {
    if (a.length < b.length) return -1;
    else
    if (a.length > b.length) return 1;
    return 0;
}

 function _WA_sort_fct_scoring(a, b)
 {
	var _objSearch1 = a._objSearchResult
	var _objSearch2 = b._objSearchResult

    if (_objSearch2.scoring < _objSearch1.scoring) return -1;
    else
    if (_objSearch2.scoring > _objSearch1.scoring) return 1;

    if (_objSearch1.typ < _objSearch2.typ) return -1;
    else
    if (_objSearch1.typ > _objSearch2.typ) return 1;


    return 0;
}
-->
