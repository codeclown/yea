describe('Bundle', () => {
  it('exports yea', () => {
    expect(yea).to.be.ok;
    expect(yea.constructor.name).to.equal('YeaAjaxRequest');
  });

  it('exposes jsonResponseTransformer', () => {
    expect(yea.jsonResponseTransformer).to.be.a('function');
  });
});
