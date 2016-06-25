const exec = require('child_process').exec;
const restify = require('restify');
const builder = require('botbuilder');

const DialogAction = builder.DialogAction;
const Message = builder.Message;
const Prompts = builder.Prompts;
const prompts = require('./prompts');

const
    spawnSync = require( 'child_process' ).spawnSync

// Create bot
const appId = process.env.CHATFUELBOT_ID
const appSecret = process.env.CHATFUELBOT_SECRET


var bot = new builder.BotConnectorBot({ appId: appId, appSecret: appSecret });

// Install logging middleware
bot.use(function (session, next) {
    console.log('Message Received: ', session);
    console.log('Attachments received: ', session['message']['attachments']);
    next();
});

// routes
bot.add('/', function (session) {
    console.log('at /');
    var cmd = '$HOME/tensorflow/bazel-bin/tensorflow/examples/label_image/label_image --graph=$HOME/chatfuelhack/nets/flowers/output_graph.pb --labels=$HOME/chatfuelhack/nets/flowers/output_labels.txt --output_layer=final_result --image=$HOME/flower_photos/daisy/21652746_cc379e0eea_m.jpg';
    session.send(prompts.wait);

    // exec(cmd, function(error, stdout, stderr) {
    //     console.log('cmd execution was finished');
    //     console.log(error)
    //     console.log(stdout)

    //     // command output is in stdout    
    //     session.send(stdout);
    // });

    session.send('ffdfd111')

    var imagePath = `${process.env.HOME}/flower_photos/daisy/21652746_cc379e0eea_m.jpg`;
    console.log('start tf');
    //var ls = spawnSync('ls', ['-lh', '/usr']);
    var tf = spawnSync(`${process.env.HOME}/tensorflow/bazel-bin/tensorflow/examples/label_image/label_image`, 
        [
            `--graph=${process.env.HOME}/chatfuelhack/nets/flowers/output_graph.pb`, 
            `--labels=${process.env.HOME}/chatfuelhack/nets/flowers/output_labels.txt`, 
            `--output_layer=final_result`, 
            `--image=${imagePath}`
        ]
    );
    console.log('end tf');


    console.log( `stdout: ${tf.stdout}` );
    console.log( `stderr: ${tf.stderr}` );
    const output = tf.stdout.toString();
    const error = tf.stderr.toString();
    const lines = error.split(/(\r?\n)/g);


    session.send(output);
    session.send(lines[1]);
    session.send(error);

});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(3999, function () {
    console.log('%s listening to %s', server.name, server.url); 
});