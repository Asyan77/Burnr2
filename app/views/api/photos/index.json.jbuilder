@photos.each do |photo|
    json.set! photo.id do
        json.partial! 'photo', photoo: photo
    end 
end