const mockAxios = {
    post: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(() => null),
    isAxiosError: jest.fn(() => true),
};

mockAxios.create.mockImplementation(() => mockAxios as any);

export default mockAxios;
