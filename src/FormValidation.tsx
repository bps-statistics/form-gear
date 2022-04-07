// import { create, test, enforce, only, each } from 'vest';
// import { validation } from './stores/ValidationStore'

// const suite = create((data = {}, currentField) => {
//   only(currentField);
//   each(validation.details.testFunctions, element => {
//     test(
//       element.dataKey,
//       element.message,
//       () => {
//         let val = [];
//         element.componentList.forEach((component, index) => {
//           const valueIndex = data.findIndex(obj => obj.dataKey === component);
//           val[index] = '';
//           if(valueIndex !== -1 && (data[valueIndex].answer)) val[index] = data[valueIndex].answer;
//         })
        
//         enforce.extend({
//           isValid: (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) => {
//             return {
//               pass: !eval(element.testString)
//             };
//           },
//         });

//         if(val.length == 1){
//           enforce(val[0]).isValid();
//         } else if(val.length == 2){
//           enforce(val[0]).isValid(val[1]);
//         } else if(val.length == 3){
//           enforce(val[0]).isValid(val[1], val[2]);
//         } else if(val.length == 4){
//           enforce(val[0]).isValid(val[1], val[2], val[3]);
//         } else if(val.length == 5){
//           enforce(val[0]).isValid(val[1], val[2], val[3], val[4]);
//         }
//       },
//       element.id // the key is used to guarantee state persistence on reordering
//     );
//   });
// });

// export default suite;
