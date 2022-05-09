# Changelog

## FormGear | Ver. 0.1.1

> May 10, 2022

### Added
- Add a condition to check private or public lookup for Select Input.
- Update MaskingInput placeholder fit to the format in the template.
- Add HTML input attributes on the JSON template to enrich validation with input component validation, as well as optimize rendering performance.
	```json
	"rangeInput":
		[
			{
				"min":0,
				"max":100,
				"step":5
			}
		]
	```
	```json
	"lengthInput":
		[
			{
			   "minlength":3,
			   "maxlength":120
			}
		]
	```
- Add PrincipalStore to save notable responses. Principal markers can be added to certain components selected in the JSON template in numeric types, and starting with 1 denotes the most important principal.
	```json
	"principal":1
	```
- Add ListError Modal to provide the list of error component during data collection.
- Add NowInput to get the current time post trigger button click: Type #35.
- Add required label on input component to specifies that an input field must be filled out before submit.
	```json
	"required":true
	```
- Add LocaleStore to handle dialog messages. Each message which is by default in English can be adjusted manually one by one with the local language. The `language` can be added equivalently to the `components`, i.e. at the first level of the JSON template.
	```json
	"language": 
		[
		      {
		         "componentAdded": "Komponen berhasil ditambahkan",
		         "componentDeleted": "Komponen berhasil dihapus",
		         "componentEdited": "Komponen berhasil diubah",
		         "componentEmpty": "Komponen tidak boleh kosong",
		         "componentNotAllowed": "Hanya ada 1 komponen yang boleh diubah",
		         "componentRendered": "Komponen yang berhubungan sedang dibentuk",
		         "componentSelected": "Komponen ini telah dipilih",
		         "fetchFailed": "Gagal mengunduh data",
		         "fileInvalidFormat": "Harap masukkan fail dengan format yang sesuai",
		         "fileUploaded": "File berhasil diunggah",
		         "locationAcquired": "Lokasi berhasil didapatkan",
		         "remarkAdded": "Remark berhasil ditambahkan",
		         "remarkEmpty": "Remark tidak boleh kosong",
		         "submitEmpty": "Pastikan isian terisi semua",
		         "submitInvalid": "Pastikan isian terisi dengan benar",
		         "submitWarning": "Masih terdapat warning pada isian",
		         "summaryAnswer": "Terjawab",
		         "summaryBlank": "Kosong",
		         "summaryError": "Salah",
		         "summaryRemark": "Catatan",
		         "validationMax": "Nilai maksimal adalah",
		         "validationMaxLength": "Maksimal panjang karakter adalah",
		         "validationMin": "Nilai minimal adalah",
		         "validationMinLength": "Minimal panjang karakter adalah",
		         "validationRequired": "Wajib diisi",
		         "verificationInvalid": "Masukkan verifikasi dengan benar",
		         "verificationSubmitted": "Data berhasil dikirimkan"
		      }
		],
	```

### Changed
- In JSON validations, it is a must to use `getRowIndex()` to get the level of the component.
	```json
	{
	   "test":"let row0 = getRowIndex(0); let row1 = getRowIndex(1); let row2 = getRowIndex(2); let val406 = getValue('l2_r406#'+row2+'#'+row1+'#'+row0); let val407 = getValue('l2_r407#'+row2+'#'+row1+'#'+row0); console.log('406', val406); console.log('407',val407);if(val406 !== undefined && val407 !== undefined && val406 !== '' && val407 !== ''){ (Number(val406[0].value) > 4 && Number(val407[0].value) == 2022)}",
	   "message":"If R406 > 4, then R407 must in 2022",
	   "type":2
	},
	```

### Fixed
- Update modal position from the bottom to the center of the screen.
- Update version marker display to show the version of the library.





---



## FormGear | Ver. 0.1.0

> April 10, 2022

Initial minor version release

### Features
- Render data collection form separated by section.
- Provide general input fields for data collection.
- Provide nested form inquiries for recurring fields.
- Efficiently validate entry on FALSE condition.
- Enable form control through expression.
- Provide variable input from expression.
- Provide remarks to record additional details.
- Provide preset entry prior to data collection.
- Provide CSV input then consume it as a JSON value.
- Able to access image files or utilize native camera function to provide Photo Input.
- Able to utilize native GPS function to provide Location Input.
- Work across multiple data collection platforms, including CAPI and CAWI.
