var dlg = new Window('dialog', '🍞PAN工場🍞', undefined, { closeButton: false });

// 速度
var speedPanel = dlg.add('panel');
speedPanel.text = '速度（mm/コマ）';
speedPanel.orientation = 'row';

//スライダーの長さの最大値はここで調整
var speedSlider = speedPanel.add('slider', undefined, 0, 0, 200);
var speedField = speedPanel.add('edittext', undefined, '0 mm');
speedField.characters = 8;

speedSlider.onChanging = function() {
    speedField.text = speedSlider.value.toFixed(0)+' mm'; 
};


speedSlider.onChange = function() {
    speedField.text = speedSlider.value.toFixed(0)+' mm'; 
};

// 表示時間
var lengthPanel = dlg.add('panel');
lengthPanel.text = '表示時間（秒＋フレーム）';
lengthPanel.orientation = 'row';

//スライダーの長さの最大値はここで調整
var lengthSlider = lengthPanel.add('slider', undefined, 0, 0, 480);
var lengthField = lengthPanel.add('edittext', undefined, '0 sec');
lengthField.characters = 8;

lengthSlider.onChanging = function() {
    var value = lengthSlider.value.toFixed(0);
    var seconds = Math.floor(value / 24);
    var frames = value % 24;
    lengthField.text = seconds + ' sec ' + frames + ' fr';
};

lengthSlider.onChange = function() {
    var value = lengthSlider.value.toFixed(0);
    var seconds = Math.floor(value / 24);
    var frames = value % 24;
    lengthField.text = seconds + ' sec ' + frames + ' fr';
};

// 延長する方向（角度）
var anglePanel = dlg.add('panel');
anglePanel.text = '延長する方向';
anglePanel.orientation = 'row';

var angleSlider = anglePanel.add('slider', undefined, 0, -180, 180);

var scriptFilePath = new File($.fileName);

var scriptDirectory = scriptFilePath.parent;

var img = anglePanel.add('image', [0, 0, 30, 30]);

updateImage(0);

var angleField = anglePanel.add('edittext', undefined, ' 0'+' °');
angleField.characters = 4;

function updateImage(angleValue) {
    var imageName = "/resource/deg/" + angleValue + ".png"; 
    var newImagePath = new File(scriptDirectory + imageName); 

    if (newImagePath.exists) {
        img.image = newImagePath; 
    } else {
        alert("画像が見つかりません: " + imageName); 
    }
}

angleSlider.onChanging = function() {
    var angleValue = angleSlider.value.toFixed(0); 
    angleField.text = angleValue + ' °';
    updateImage(angleValue); 
};

angleSlider.onChange = function() {
    var angleValue = angleSlider.value.toFixed(0); 
    angleField.text = angleValue + ' °';
    updateImage(angleValue); 
};


var buttonsPanel = dlg.add('group');
var okButton = buttonsPanel.add('button', undefined, '実行');
var closeButton = buttonsPanel.add('button', undefined, 'キャンセル');

okButton.onClick = function () {
  var mmPerK = parseFloat(speedField.text);
  var angle = parseFloat(angleField.text);
  var length = parseFloat(lengthField.text);
  var totallength = mmPerK * length;

  if (-45 <= angle && angle <= 45) {
    // 0度に傾きを修正
    app.activeDocument.rotateCanvas(-angle);
  } else if (45 < angle && angle < 135) {
    // 90度に傾きを修正
    app.activeDocument.rotateCanvas(-angle + 90);
  } else if (-135 <= angle && angle <= -45) {
    // -90度に傾きを修正
    app.activeDocument.rotateCanvas(-angle - 90);
  } else {
    // 180度に傾きを修正
    app.activeDocument.rotateCanvas(-angle + 180);
  }

  var canvasWidth = app.activeDocument.width.value;
  var canvasHeight = app.activeDocument.height.value;

  var newWidth = canvasWidth;
  var newHeight = canvasHeight;

  var x;
  var y;
  if (-45 <= angle && angle <= 45) {
    x = newWidth += totallength;
    y = newHeight;
  } else if (45 < angle && angle < 135) {
    x = newWidth;
    y = newHeight += totallength;
  } else if (-135 <= angle && angle <= -45) {
    y = newHeight += totallength;
    x = newWidth;
  } else {
    x = newWidth += totallength;
    y = newHeight;
  }

  var direction;
  if (-45 <= angle && angle <= 45) {
    direction = AnchorPosition.TOPLEFT;
  } else if (45 < angle && angle < 135) {
    direction = AnchorPosition.BOTTOMCENTER;
  } else if (-135 <= angle && angle <= -45) {
    direction = AnchorPosition.TOPCENTER;
  } else {
    direction = AnchorPosition.BOTTOMRIGHT;
  }

  app.activeDocument.resizeCanvas(x, y, direction);

  dlg.close();
};


closeButton.onClick = function () {
  dlg.close();
};

dlg.show();