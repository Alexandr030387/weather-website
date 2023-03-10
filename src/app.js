const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express();

// Define paths for Express config
const publicDirectoryPAth = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlerbars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPAth))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alex Pohrebniak'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Alex Pogrebniak'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help page',
        name: 'Alex Pogrebniak'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an addess'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error: error })
        }

    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error: error })
            }

            return res.send({
                'forecast': forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term',
        });    
    }
    
    console.log(req.query.search);
    return res.send({
        'products': [],
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 page',
        name: 'Alex Pogrebniak',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page',
        name: 'Alex Pogrebniak',
        errorMessage: 'Page not found'
    })
});


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})