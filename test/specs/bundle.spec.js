describe('Bundle', function () {
  it('exports yea', function () {
    expect(yea).to.be.ok;
    expect(yea.constructor.name).to.equal('YeaAjaxRequest');
  });

  it('exposes jsonResponseTransformer', function () {
    expect(yea.jsonResponseTransformer).to.be.a('function');
  });
});
