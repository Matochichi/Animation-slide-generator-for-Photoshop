//////////////////////////////////////////////////////////////////////////
// PAN-FAC
// Ver.1.0
// Author：ma_tochichi
// This program will expand the canvas for slides and platforms by setting values.
// Angle correction is also included.
// Redistribution prohibited._(┐「ε:)_
// last changed:2023/12/05
///////////////////////////////////////////////////////////////////////////

/*
<javascriptresource>
<name>PAN-FAC</name>
<menu>help</menu>
<category>Layers</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

if (app && app.documents.length > 0) {
  var outputFilePath = new File($.fileName);
  var outputDirectory = outputFilePath.parent;

  function savePNG(doc) {

    var width = doc.width.value;
    var height = doc.height.value;

    var docCopy = doc.duplicate();

    var saveFile = new File("C:/PS_prev/docprev.png");

    var targetWidth = 300;
    var targetHeight = 300;

    var ratio = Math.min(targetWidth / width, targetHeight / height);
    var newWidth = width * ratio;
    var newHeight = height * ratio;

    docCopy.resizeImage(newWidth + "px", newHeight + "px");

    docCopy.saveAs(saveFile, new PNGSaveOptions(), true);

    docCopy.close(SaveOptions.DONOTSAVECHANGES);
  }

  // メインの処理
  function main() {
    var doc = app.activeDocument;
    var outputFolder = Folder("C:/PS_prev");

    if (!outputFolder.exists) {
      outputFolder.create();
    }

    savePNG(doc, outputFolder);
  }

  try {
    main();
  } catch (e) {
    alert("エラーが発生しました: " + e);
  }

  var dlg = new Window('dialog', '🍞PAN工場🍞', undefined, { closeButton: true });

  var prevFilePath = new File($.fileName);
  var prevDirectory = prevFilePath.parent;
  var prevPanel = dlg.add('panel');

  prevPanel.text = '編集が適用されるドキュメント';
  prevPanel.orientation = 'row';

  var relativeImagePathString = "C:/PS_prev/docprev.png";

  var scriptFile = new File($.fileName);
  var scriptDirectory = scriptFile.parent;

  var absoluteImagePath = new File("C:/PS_prev/docprev.png");

  var img = prevPanel.add("image", undefined);
  // img.preferredSize = [300, 300];

  if (absoluteImagePath.exists) {
    img.image = absoluteImagePath;
  } else {
    alert("ディレクトリに画像が確認できません。" + absoluteImagePath);
  }

  // 速度
  var speedPanel = dlg.add('panel');
  speedPanel.text = '速度（mm/コマ）';
  speedPanel.orientation = 'row';

  //スライダーの長さの最大値はここで調整
  var speedSlider = speedPanel.add('slider', undefined, 0, 0, 200);
  var speedField = speedPanel.add('edittext', undefined, '0 mm');
  speedField.characters = 8;

  speedSlider.onChanging = function () {
    speedField.text = speedSlider.value.toFixed(0) + ' mm';
  };

  speedSlider.onChange = function () {
    speedField.text = speedSlider.value.toFixed(0) + ' mm';
  };

  // 表示時間
  var lengthPanel = dlg.add('panel');
  lengthPanel.text = '表示時間（秒＋フレーム）';
  lengthPanel.orientation = 'row';

  //スライダーの長さの最大値はここで調整
  var lengthSlider = lengthPanel.add('slider', undefined, 0, 0, 240);
  var lengthField = lengthPanel.add('edittext', undefined, '0 sec');
  lengthField.characters = 8;

  lengthSlider.onChanging = function () {
    var value = lengthSlider.value.toFixed(0);
    var seconds = Math.floor(value / 24);
    var frames = value % 24;
    lengthField.text = seconds + ' sec ' + frames + ' fr';
  };

  lengthSlider.onChange = function () {
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

  var angleField = anglePanel.add('edittext', undefined, ' 0' + ' °');
  angleField.characters = 4;

  function updateImage(angleValue) {
    var imageName = "/resource/deg/" + angleValue + ".png";
    var newImagePath = new File(scriptDirectory + imageName);

    // debug
    // anglePanel.text =scriptDirectory + imageName;

    if (newImagePath.exists) {
      img.image = newImagePath;
    } else {
      alert("ディレクトリに画像が確認できません。" + imageName);
    }
  }

  angleSlider.onChanging = function () {
    var angleValue = angleSlider.value.toFixed(0);
    angleField.text = angleValue + ' °';
    updateImage(angleValue);
  };

  angleSlider.onChange = function () {
    var angleValue = angleSlider.value.toFixed(0);
    angleField.text = angleValue + ' °';
    updateImage(angleValue);
  };

  function saveLog(speed, length, angle) {
    var logFile = new File(scriptDirectory + "/resource/log.json");
    var logData = {
      "speed": speed,
      "length": length,
      "angle": angle
    };

    if (!logFile.exists) {
      logFile.open("w");
      logFile.write(JSON.stringify([logData]));
      logFile.close();
    } else {
      logFile.open("r");
      var existingData = JSON.parse(logFile.read());
      existingData.push(logData);
      logFile.open("w");
      logFile.write(JSON.stringify(existingData));
      logFile.close();
    }
  }

  var buttonsPanel = dlg.add('group');
  var okButton = buttonsPanel.add('button', undefined, '実行');
  var closeButton = buttonsPanel.add('button', undefined, 'キャンセル');

  okButton.onClick = function () {
    var mmPerK = parseFloat(speedField.text);
    var angle = parseFloat(angleField.text);
    var length = parseFloat(lengthSlider.value);
    var totallength = mmPerK * length;

    if (angle >= -45 && angle <= 45) {
      app.activeDocument.rotateCanvas(-(-angle));
    } else if (angle > 45 && angle <= 135) {
      app.activeDocument.rotateCanvas(-(90 - angle));
    } else if (angle > 135 || angle <= -135) {
      app.activeDocument.rotateCanvas(-(-angle + (angle > 0 ? 180 : -180)));
    } else if (angle > -135 && angle <= -45) {
      app.activeDocument.rotateCanvas(-(-angle - 90));
    } else {
      //何しようか思いつかなかった
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

} else {
  alert("ドキュメントが開かれていません (;_;)");
}