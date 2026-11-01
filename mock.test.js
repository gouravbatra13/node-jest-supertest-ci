describe('Mock function testing', () => {
  test('should check if function was called', () => {
    const sendEmail = jest.fn();

    sendEmail('user@example.com');

    expect(sendEmail).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith('user@example.com');
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  test('mock function can return a value', () => {
    const getUser = jest.fn().mockReturnValue({
      id: 1,
      name: 'Test User',
    });

    const user = getUser();

    expect(user.name).toBe('Test User');
  });
});