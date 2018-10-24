describe('Bundle', () => {
  it('exports ImmutableAjaxRequest', () => {
    expect(ImmutableAjaxRequest).to.be.ok;
  });

  it('exports request', () => {
    expect(request).to.be.ok;
    expect(request).to.be.instanceOf(ImmutableAjaxRequest);
  });
});
