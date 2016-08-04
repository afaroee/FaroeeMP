/**
 * @author: Andi Dwi a.k.a faroee//aleen-/andyvrc
 * @app_name: Flat Faroee Media Player
 * @app_version: i tought it was 0.1 beta delta tetha lol
 * @company: well i'am looner! brat! XD
 */
//Import Plugins and Script 

app.LoadPlugin("UIExtras");

// global var
item = ""; 
nowPlay = "";
json_media = "";
songList_obj = "";
songList = "";
title_replacer = "";
dur = null;
pos_txt = "";
//Called when application is started.
function OnStart()
{
    // Create media player container
    player = app.CreateMediaPlayer();
    player.SetOnReady( player_OnReady );
    setInterval("Update()", 1000);
    // Create media store and set callbacks function
    media = app.CreateMediaStore();
    media.SetOnMediaResult( media_OnMediaResult );

/** 
 *   #######>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *      below is UI design for layout etc
 * <<<<<<<<<<<<<<<<<<<<<<<<##################
 * 
 **/
 	
 	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "FillXY" );	
	
	//Create a text label and add it to layout.
	txt = app.CreateText( "Faroee Flat Player",1.0);
	txt.SetBackColor("#1cbcff");
	txt.SetTextColor("#ff9933");
	txt.SetPadding(0,0.01,0,0.01);
	txt.SetTextSize( 28 );
	lay.AddChild( txt );
	
	//Create Tabbed Panel
	var tabPane = app.CreateTabs("My Music,Playlist,Album",1.0,0.75);
	lay.AddChild(tabPane);
	
	//layout my music tab
	layMY_MUSIC = tabPane.GetLayout("My Music");
	btn_CheckMedia = app.CreateButton("[fa-search] Get Media Automatically", 0.5, -1, "Custom,FontAwesome");
	btn_CheckMedia.SetStyle("#4285F4", "#4285F4", 3);
	btn_CheckMedia.SetMargins(0,0.05,0,0);
	btn_CheckMedia.SetOnTouch(CheckMedia_Touched);
	layMY_MUSIC.AddChild(btn_CheckMedia);
	
	uix = app.CreateUIExtras();
	
	// Layout for FloatActButton
	layFab = app.CreateLayout("Linear","FillXY,Bottom,Right,TouchThrough");
    fab = uix.CreateFAButton("[fa-plus]");
	fab.SetMargins(0.02,0.01,0.02,0.01);
    fab.SetButtonColors("#db4437","#c33d32");
    fab.SetOnTouch(fab_Touched);
	layFab.AddChild(fab);
	
	
	// Create Media Player Play,Pause,etc Button
	layPlayer = app.CreateLayout("Linear","Horizontal,Bottom,Left,FillY,TouchThrough");
	
	btnPlay = app.CreateButton("[fa-play]",0.3,0.075,"Custom,FontAwesome");
	btnPlay.SetOnTouch(btnPlay_Touched);
	
	btnNext = app.CreateButton("[fa-arrow-circle-o-right]",0.22,0.04,"Custom,FontAwesome");
	btnNext.SetOnTouch(btnNext_Touched);
	
	btnPrev = app.CreateButton("[fa-arrow-circle-o-left]",0.22,0.04,"Custom,FontAwesome");
	btnPrev.SetOnTouch(btnPrev_Touched);
	
	// seekbar layout container
	laySkb = app.CreateLayout("Linear","FillXY,Left,TouchThrough");
	layDurTxt = app.CreateLayout("Linear","FilXY,Right,TouchThrough");
	
	skbPlayer = app.CreateSeekBar(0.6, -1);
	skbPlayer.SetMargins(0, 0.83, 0, 0);
	skbPlayer.SetOnTouch( skbPlayer_Touched );
	skbPlayer.SetRange(1.0);
	
	txtPos = app.CreateText(" ",0.2,0.1);
	txtPos.SetMargins(0,0.83,0.3,0);
	txtPos.SetTextColor("#ff9933");
	
	laySkb.AddChild(skbPlayer);
	//laySkb.AddChild(txtPos);
	layDurTxt.AddChild(txtPos);
	layPlayer.AddChild(btnPrev);
	layPlayer.AddChild(btnPlay);
	layPlayer.AddChild(btnNext);
	//Add layout to app.	
	app.AddLayout( lay );
	app.AddLayout(layFab);
	app.AddLayout( layPlayer );
	app.AddLayout( laySkb );
	app.AddLayout( layDurTxt );
	
}

//fab_touched func
function fab_Touched() {

}

//CheckMedia Automatically Touched func
function CheckMedia_Touched() {
    //Usage:- QueryMedia( select, sort, options )
    
    //Some sample queries:-
    //media.QueryMedia( "title=Code Monkey", "");
    //media.QueryMedia( "title like %", "" );
    //media.QueryMedia( "title like %fire%", "", "external" );
    //media.QueryMedia( "", "album" );
    //media.QueryMedia( "title like %fire%", "album" );
    
    app.ShowProgress( "Finding Media...");
    media.QueryMedia("","","external, internal");
}


//median_OnMediaResult func
function media_OnMediaResult(result) {
  //set local variable
    s = "";
    json_mediaHeader = "";
    json_mediaBody = "";
    json_mediaFooter = "";
    json_mediaDummy = "";
    
 //   var item;
    for (var i=0; i<result.length; i++) {
        item = result[i];
        s += item.title+", " + item.albumId + ", " + item.album
        +", "+item.artistId+", "+ item.artist+
            ", "+ Math.round(item.duration/1000)+"s" +
            ", "+ Math.round(item.size/1000)+"KB" + 
            ", "+ item.uri +"\n\n";
        
        var str_title = item.title;
        title_replacer = str_title.replace(",", "-");
        
        json_mediaHeader = '{ "music_list" : [';
       
            json_mediaBody += '\n\t\t{\n\t\t\t"title":"' + title_replacer + '", "uri":"' + item.uri + '", "artist":"' +
            item.artist + '", "album":"' + item.album + '", "duration":"' + Math.round(item.duration/1000) + 's", "size":"' + Math.round(item.size/1000) + 'KB"\n\t\t},';
            json_mediaDummy = '\n\t\t{\n\t\t\t"title":"", "uri":"", "artist":"", "album":"", "duration":"", "size":""\n\t\t}';
            
        json_mediaFooter = '\n\t]\n}';
        
        json_media = json_mediaHeader+json_mediaBody+json_mediaDummy+json_mediaFooter;
        
    }
    
    //stringify JSON_MEDIA
    json_mediastr = JSON.stringify(json_media);
        
    // create folder and write json file
    app.MakeFolder("/sdcard/FaroeeMP/");
    app.WriteFile("/sdcard/FaroeeMP/autogen_music.json", json_media);
    //fz = app.GetFileSize("/sdcard/FaroeeMP/autogen_music.json");

    //check json by opening in alert also parsing it
    ex = app.FileExists("/sdcard/FaroeeMP/autogen_music.json");
    if (ex == true) {
        red = app.ReadFile("/sdcard/FaroeeMP/autogen_music.json"); 
        songList_obj = JSON.parse(red);
        alert(red);
    } else {
        app.ShowPopup("JSON File Not Found");
    }
    
    // Listing music file from JSON array
    for (var j = 0; j<result.length; j++) {
        if (j >= 0) songList += ",";
        songList += j+1 + ". " + songList_obj.music_list[j].title +
                    ":Artist^c^ " + songList_obj.music_list[j].artist;
    }
    
    app.HideProgress();
    MyMusic_songList = app.CreateList(songList,1.0,0.75);
    MyMusic_songList.SetTextMargins(0.04,0,0,0);
    MyMusic_songList.SetOnTouch(songItem_Touched);
    layMY_MUSIC.AddChild(MyMusic_songList);
    
    if (MyMusic_songList.IsVisible) {
      //  btn_CheckMedia.SetVisibility("Hide");
        //btn_CheckMedia.Hide();
        btn_CheckMedia.Gone();
    } else {
        alert("something issues error");
    }
    alert( s.substr(0,2048) );
    
    //Play first file found.
    if( result.length > 0 )
        player.SetFile( result[0].uri );
}

//player_Onready func
function player_OnReady() {
    dur = player.GetDuration();
    player.Play();
    if (player.IsPlaying() == true) {
        btnPlay.SetText("[fa-pause]");
    } else {
        btnPlay.SetText("[fa-play]");
    }
    
    
}
    
    
//when song item touched on MyMusic_listView
function songItem_Touched(title, body, type, index) {
app.ShowPopup("Now Playing = " + title);
nowPlay = songList_obj.music_list[index-1].uri;
  player.SetFile(nowPlay);
  player.Play();
}

//when btn_play touched
function btnPlay_Touched() {
    if (player.IsPlaying() == true) {
        btnPlay.SetText("[fa-play]");
        player.Pause();
    } else {
        btnPlay.SetText("[fa-pause]");
        player.Play();
    }
}

//when btn_next touched
function btnNext_Touched(nextItem) {}

///when btn_prev touched
function btnPrev_Touched(prevItem) {}

//when user using seekbar
function skbPlayer_Touched(val) {
    player.SeekTo(dur*val);    
}

//Update seek bar position following through media is now playing
function Update() {
    play_pos = player.GetPosition();
    if (dur) skbPlayer.SetValue(play_pos / dur);
    pos_txt = parseInt(play_pos);
    if (dur) txtPos.SetText(pos_txt.toString());
}
