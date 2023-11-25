var dlg = new Window('dialog', 'PAN generator', undefined, { closeButton: false });

dlg.add('statictext', undefined, 'mm per k:');
var mmPerKField = dlg.add('edittext', undefined, ''); // mm per k の初期値を設定

var anglePanel = dlg.add('group');
var angleField = anglePanel.add('edittext', undefined, '');
anglePanel.add('statictext', undefined, '角度（度）');

var lengthPanel = dlg.add('group');
var lengthField = lengthPanel.add('edittext', undefined, '');
lengthPanel.add('statictext', undefined, '長さ');

var buttonsPanel = dlg.add('group');
var okButton = buttonsPanel.add('button', undefined, '実行');
var closeButton = buttonsPanel.add('button', undefined, 'キャンセル');

okButton.onClick = function() {
  var mmPerK = parseFloat(mmPerKField.text); 
  var angle = parseFloat(angleField.text);
  var length = parseFloat(lengthField.text);
  var totallength = (mmPerK * length);

  var doc = app.activeDocument;
  var radians = angle * (Math.PI / 180); // 角度をラジアンに変換

  var extensionX = 0;
  var extensionY = 0;

  // 角度に基づいて上下左右に伸ばす
  if ((angle >= 0 && angle < 90) || (angle >= 270 && angle < 360)) {
    // 右向き
    extensionX = Math.abs(totallength * Math.cos(radians));
  } else if (angle >= 90 && angle < 180) {
    // 下向き
    extensionY = Math.abs(totallength * Math.sin(radians));
  } else if (angle >= 180 && angle < 270) {
    // 左向き
    extensionX = -Math.abs(totallength * Math.cos(radians));
  } else if (angle >= 270 && angle < 360) {
    // 上向き
    extensionY = -Math.abs(totallength * Math.sin(radians));
  }

  // キャンバスが左向き　上向きの場合は、角度処理を行う前にキャンバス自体を180度回転させてから処理を行う
  // 処理を行う際には、180度回転させたあとは、該当の場合にのみ（左向き　上向きの場合）再度180度回転させる処理を組み込む。
  
  // 注意：キャンバスを回転処理する前に、定規かなんかのツールを使ってキャンバスの傾きを直してから上記の処理を行う。 

  var canvasWidth = doc.width + Math.abs(extensionX);
  var canvasHeight = doc.height + Math.abs(extensionY);

  // キャンバスが小さい方の辺よりも小さい場合、警告を表示して処理を中止
  if (canvasWidth < 0 || canvasHeight < 0) {
    alert('警告: 算出されたスライド長がキャンバスのサイズよりも小さいため処理を中止します。');
    return;
  }

  // キャンバスを拡張
  doc.resizeCanvas(canvasWidth, canvasHeight, AnchorPosition.TOPLEFT);

  dlg.close();
};


closeButton.onClick = function() {
  dlg.close();
};

dlg.show();
