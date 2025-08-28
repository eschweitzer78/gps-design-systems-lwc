class OaDataLayer {
  _dataLayer = [];

  constructor() {
    this._dataLayer = [];
  }

  addEvent(eventData) {
    this._dataLayer.push(eventData);
  }

  isEmpty() {
    return this._dataLayer.length === 0;
  }

  getFirstEvent() {
    if (this._dataLayer.length > 0) {
      return this._dataLayer.shift();
    }
    return null;
  }

  peak() {
    if (this._dataLayer.length > 0) {
      return this._dataLayer[0];
    }
    return null;
  }

  eventAt(index) {
    return this._dataLayer[index];
  }

  size() {
    return this._dataLayer.length;
  }
}

export { OaDataLayer };
