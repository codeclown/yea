describe('Bundle', () => {
  it('exports supremeAjax', () => {
    expect(supremeAjax).to.be.ok;
    expect(supremeAjax.constructor.name).to.equal('SupremeAjaxRequest');
  });

  it('exposes jsonResponseTransformer', () => {
    expect(supremeAjax.jsonResponseTransformer).to.be.a('function');
  });
});
