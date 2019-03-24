describe('Bundle', () => {
  it('exports supremeAjax', () => {
    expect(supremeAjax).to.be.ok;
  });

  it('exposes jsonResponseTransformer', () => {
    expect(supremeAjax.jsonResponseTransformer).to.be.a('function');
  });
});
