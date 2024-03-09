import { AbstractControl } from "@angular/forms";
import { Observable, Observer, fromEvent, of, switchMap } from "rxjs";

// null means valid; [key: string] -> don't care about the name of the property
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof (control.value) === 'string') {
    return of(null);
  } // if

  const file = control.value as File;
  const fileReader = new FileReader();

  /* const frObs$ = Observable.create ((observer: Observer<{[key: string]: any}>) => {
      fileReader.addEventListener ("loadend", () => {
          const array = new Uint8Array (fileReader.result as ArrayBuffer).subarray(0, 4); // Allows us to read a certain patterns in the file
          // Now we can read the mime type of the file
          let header = "";
          let isValid = false;

          for (let i = 0; i < array.length; i++) {
              header+= array[i].toString (16);
          } // for

          switch (header) {
              case "89504e47":
                isValid = true;
                break;
              case "ffd8ffe0":
              case "ffd8ffe1":
              case "ffd8ffe2":
              case "ffd8ffe3":
              case "ffd8ffe8":
                isValid = true;
                break;
              default:
                isValid = false; // Or you can use the blob.type as fallback
                break;
            } // switch - case

            if (isValid) {
              observer.next (null);
            } else {
              observer.next ({ invalidMimeType: true});
            } // if - else

            observer.complete ();
      });
      fileReader.readAsArrayBuffer (file);
  }); */

  const frObs$ = fromEvent(fileReader, 'loadend').pipe(
    switchMap(() => {
      const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      const header = Array.from(array).map(byte => byte.toString(16)).join('');

      const isValid = ['89504e47', 'ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'].includes(header);

      return isValid ? of(null) : of({ invalidMimeType: true });
    })
  );

  fileReader.readAsArrayBuffer(file);
  return frObs$;
};
