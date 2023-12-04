from PIL import Image

# 元の画像のパス
original_image_path = 'resource/deg/0.png'

# 画像を開く
original_image = Image.open(original_image_path)

# 360度の範囲で1度ずつ回転して新しい画像を作成
for angle in range(-180, 181):
    # 画像を回転
    rotated_image = original_image.rotate(angle)
    
    # 保存するファイル名を生成
    new_image_path = f'resource/deg/{angle}.png'
    
    # 画像を保存
    rotated_image.save(new_image_path)

    print(f'Saved: {new_image_path}')

# 元の画像を閉じる
original_image.close()
