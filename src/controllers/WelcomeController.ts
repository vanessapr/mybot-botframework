class WelcomeController {
    public static sayHello(request, response) {
        return response.send('hello world');
    }
}

export default WelcomeController;
