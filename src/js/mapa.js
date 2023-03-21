(function() {
    // se obtiene el valor de los inputs del front hidden lat y lng 
    const lat = document.querySelector('#lat').value || 6.2857947;
    const lng = document.querySelector('#lng').value || -75.6036545;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    // utilizar Provider y Geocoder = obtener cordenadas y el numero de la calle
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // PIN
    marker = new L.marker([lat,lng], {
        draggable: true, // se puede mover el pin
        autoPan: true // se centra al mover el pin
    })
    .addTo(mapa)

    // detectar el movimiento del pin
    marker.on('moveend', function(e){
        console.log(e.target);
        marker = e.target
        const posicion = marker.getLatLng(); // esta funcion obtiene la posicion donde esta el pin
        
        //panTo = centra la pantalla donde esta el pin
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)) 

        // obtener informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function(err, resultado) {
            console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel)

            // se pinta en el front el numero de la calle 
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''

            //se asignan los datos a los inputs hidden
            document.querySelector('#calle').value = resultado?.address?.Address ?? ''
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''
        })
    })

})()