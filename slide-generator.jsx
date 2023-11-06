var gUIWindow = new Window('dialog','テストウィンドウ'); 

gUIWindow.bounds = [200,100,580,280]; 

gUIWindow.activeDocPnl = gUIWindow.add("panel",[10,5,370,90],"アクティブドキュメント"); 
gUIWindow.activeDocPnl .editText = gUIWindow.activeDocPnl .add("edittext",[10,15,345,33], ""); 

gUIWindow.activeDocPnl .editText.enabled = false ;

gUIWindow.activeDocPnl .radiorBtn1 = gUIWindow.activeDocPnl .add("radiobutton",[10,40,200,58], "オリジナル"); 
gUIWindow.activeDocPnl .radiorBtn2 = gUIWindow.activeDocPnl .add("radiobutton",[10,55,200,75], "複製"); 

gUIWindow.activeDocPnl .radiorBtn1.value = true; 

gUIWindow.dList = gUIWindow.add("dropdownlist",[15,110,365,130],["ぼかし（ガウス）20","ダスト＆スクラッチ20,10"]); 
gUIWindow.dList.selection = 0; 

gUIWindow.filterPnl = gUIWindow.add("panel",[10,90,370,140],"フィルターの処理"); 
gUIWindow.okBtn = gUIWindow.add("button",[80,145,175,170], "実行"); 
gUIWindow.cancelBtn = gUIWindow.add("button",[190,145,285,170], "キャンセル"); 

gUIWindow.show();