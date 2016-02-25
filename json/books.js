var book = new Schema({
  "_id" : int,
  "genre" : [string, string],
  "title" : string,
  "description" : string,
  "author" : int,
  "slug" : string,
  "visible" : boolean,
  "subjects" : [string, string],
  "language" : string,
  "rate" : int
});