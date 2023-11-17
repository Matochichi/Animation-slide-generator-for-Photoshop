var dlg = new Window('dialog', 'PAN generator', undefined, { closeButton: false });

dlg.add('statictext', undefined, 'mm per k:');
var mmPerKField = dlg.add('edittext', undefined, ''); // mm per k の初期値を設定

var timeFramesPanel = dlg.add('group');
var secondsField = timeFramesPanel.add('edittext', undefined, ''); 
timeFramesPanel.add('statictext', undefined, '秒');
var framesField = timeFramesPanel.add('edittext', undefined, ''); 
timeFramesPanel.add('statictext', undefined, 'コマ');

var buttonsPanel = dlg.add('group');
var okButton = buttonsPanel.add('button', undefined, '実行');
var closeButton = buttonsPanel.add('button', undefined, 'キャンセル');

okButton.onClick = function() {
  var mmPerK = parseFloat(mmPerKField.text); 
  var seconds = parseFloat(secondsField.text); 
  var frames = parseFloat(framesField.text); 
  // var totalFrames = seconds * 24;
  var extraFrames = frames;
  var doc = app.activeDocument;
  var cmPerK = mmPerK / 10;
  var extensionWidth = cmPerK * extraFrames;

  // キャンバスが小さい方の辺よりも小さい場合、警告を表示して処理を中止
  if (extensionWidth < 0) {
    alert('警告: 算出されたスライド長がキャンバスのサイズよりも小さいため処理を中止します。');
    return;
  }

  // 右側に拡張するために切り抜き
  doc.crop([0, 0, doc.width + extensionWidth, doc.height]);

  dlg.close();
};

closeButton.onClick = function() {
  dlg.close();
};

dlg.show();


