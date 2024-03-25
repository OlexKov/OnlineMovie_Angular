export class ImageProcessor {
  static async loadImageFromFile(file: File): Promise<string> {
    let resultPromise = new Promise<string>((resolve, reject) => {
      let reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result as string);
        };
      }
    });
    return resultPromise;
  }
}
