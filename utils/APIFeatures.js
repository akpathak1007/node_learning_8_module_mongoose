class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  count = 0;
  filter() {
    let query = { ...this.queryString };
    const willRemove = ['sort', 'page', 'limit', 'fields'];
    willRemove.forEach((el) => delete query[el]);
    query = JSON.stringify(query).replace(
      /\b(gte|lt|gt|lte)\b/g,
      (match) => `$${match}`
    );
    this.query.find(JSON.parse(query));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortQuery = this.queryString.sort;
      console.log(this.queryString);
      sortQuery = sortQuery.replace(',', ' ');
      this.query.sort(sortQuery);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    let fieldQuery = this.queryString.fields;
    if (fieldQuery) {
      const fields = fieldQuery.replace(/[,]/g, ' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    let { page, limit } = this.queryString;
    page = page * 1 || 1;
    limit = limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;