// 現在のスクリプトファイルのパスを取得
var scriptFilePath = new File($.fileName);

// スクリプトファイルのディレクトリを取得
var scriptDirectory = scriptFilePath.parent;

// 画像の相対パス
var relativeImagePath = "/resource/1@0.3x.png";

// スクリプトファイルのディレクトリと相対パスを結合して絶対パスを生成
var absoluteImagePath = new File(scriptDirectory + relativeImagePath);

// 画像を表示するためのパネルを作成
var dlg = new Window('dialog', '画像ダイアログ', [100, 100, 500, 500]);
var imagePanel = dlg.add('panel', [10, 10, 110, 110], '画像');
var img = imagePanel.add('image', [0, 0, 90, 90]);

// 画像を読み込んで表示
img.image = absoluteImagePath;

// ダイアログを表示
dlg.show();
