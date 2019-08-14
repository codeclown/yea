describe('Bundle', function () {
  it('exports yea', function () {
    expect(yea).to.be.ok;

    // constructor.name is not available in IE
    if (yea.constructor.name) {
      expect(yea.constructor.name).to.equal('YeaAjaxRequest');
    }
  });

  it('exposes jsonResponseTransformer', function () {
    expect(yea.jsonResponseTransformer).to.be.a('function');
  });
});
