// GUI関連
var gUIWindow = new Window('dialog', 'Puller');
gUIWindow.bounds = [200, 100, 580, 280];

gUIWindow.previewPanel = gUIWindow.add('panel', [10, 10, 370, 130]);
gUIWindow.previewPanel.text = 'キャンバスプレビュー';

gUIWindow.previewImage = gUIWindow.previewPanel.add('image', [10, 20, 360, 120], '');

gUIWindow.okBtn = gUIWindow.add('button', [80, 145, 175, 170], '実行');
gUIWindow.okBtn.onClick = function() {
    updateCanvasPreview();
};

gUIWindow.cancelBtn = gUIWindow.add('button', [190, 145, 285, 170], 'キャンセル');
gUIWindow.cancelBtn.onClick = function() {
    gUIWindow.close();
};

// メインスクリプト

//プレビューの更新
function updateCanvasPreview() {
    var activeDoc = app.activeDocument;

    var tempFile = new File(Folder.temp + '/' + activeDoc.name + '.png');

    var pngOptions = new PNGSaveOptions();
    pngOptions.compression = 9;

    activeDoc.saveAs(tempFile, pngOptions, true, Extension.LOWERCASE);

    gUIWindow.previewImage.image = tempFile.fsName;

    tempFile.remove();
}

gUIWindow.show();
