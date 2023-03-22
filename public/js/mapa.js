/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  // se obtiene el valor de los inputs del front hidden lat y lng\r\n  const lat = document.querySelector(\"#lat\").value || 6.2857947;\r\n  const lng = document.querySelector(\"#lng\").value || -75.6036545;\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 16);\r\n  let marker;\r\n\r\n  // utilizar Provider y Geocoder = obtener cordenadas y el numero de la calle\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  // PIN\r\n  marker = new L.marker([lat, lng], {\r\n    draggable: true, // se puede mover el pin\r\n    autoPan: true, // se centra al mover el pin\r\n  }).addTo(mapa);\r\n\r\n  // detectar el movimiento del pin\r\n  marker.on(\"moveend\", function (e) {\r\n    console.log(e.target);\r\n    marker = e.target;\r\n    const posicion = marker.getLatLng(); // esta funcion obtiene la posicion donde esta el pin\r\n\r\n    //panTo = centra la pantalla donde esta el pin\r\n    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\r\n\r\n    // obtener informacion de las calles al soltar el pin\r\n    geocodeService\r\n      .reverse()\r\n      .latlng(posicion, 13)\r\n      .run(function (err, resultado) {\r\n        console.log(resultado);\r\n        marker.bindPopup(resultado.address.LongLabel);\r\n\r\n        // se pinta en el front el numero de la calle\r\n        document.querySelector(\".calle\").textContent =\r\n          resultado?.address?.Address ?? \"\";\r\n\r\n        //se asignan los datos a los inputs hidden\r\n        document.querySelector(\"#calle\").value =\r\n          resultado?.address?.Address ?? \"\";\r\n        document.querySelector(\"#lat\").value = resultado?.latlng?.lat ?? \"\";\r\n        document.querySelector(\"#lng\").value = resultado?.latlng?.lng ?? \"\";\r\n      });\r\n  });\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;