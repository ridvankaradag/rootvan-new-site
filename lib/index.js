// ./lib/index.js

var fs = require('fs');
var exec = require('child_process').exec;

var apache_log_dir = '${APACHE_LOG_DIR}';
var apache_root = '/etc/apache2/sites-available/rootvan-sites.conf';
var hosts = '/etc/hosts';

var fillContent = function(domain_name,path) {
    return `\n\n<VirtualHost *:80>   
    ServerAdmin admin@${domain_name}
       DocumentRoot ${path}
       ServerName ${domain_name}
  
       <Directory ${path}>
          Options +FollowSymlinks
          AllowOverride All
          Require all granted
       </Directory>
  
       ErrorLog ${apache_log_dir}/error.log
       CustomLog ${apache_log_dir}/access.log combined
  </VirtualHost>`;
}

var addLinetoHosts = function(domain_name) {
    return `127.0.1.1\t${domain_name}`
}

/**
 * Get domain & path
 * 
 * @param {domain_name} String domain name
 * @param {path} String local folder path
 */
var create = function(domain_name, path) {
    try{
        fs.appendFile(apache_root, fillContent(domain_name,path), function (err) {
            if (err) throw err;
            console.log('Conf file updated');
        });
        fs.appendFile(hosts, addLinetoHosts(domain_name), function (err) {
            if (err) throw err;
            console.log('Hosts file updated');
        });
        exec('a2ensite rootvan-sites.conf', (err, stdout, stderr) => {
            if (err) throw err;
            console.log('rootvan-sites enabled');
          });
          exec('sudo a2enmod rewrite', (err, stdout, stderr) => {
            if (err) throw err;
            console.log('rewrite enabled');
          });
          exec('systemctl restart apache2.service', (err, stdout, stderr) => {
            if (err) throw err;
            console.log('Apache reloaded');
          });

    }catch(err) {
        return console.log('ERROR....../n'+err)
    }

    return console.log('Your new domain '+ domain_name + ' created for '+ path);
    
};

// Allows us to call this function from outside of the library file.
// Without this, the function would be private to this file.
exports.create = create;

