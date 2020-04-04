# config valid only for current version of Capistrano
lock '3.6.0'

set :application, 'tiphive-js'
set :repo_url, 'git@github.com:groupstance/TipHiveJS.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, '.env'

# Default value for linked_dirs is []
append :linked_dirs, 'node_modules', 'log'

# Default value for default_env is {}
set :default_env, {}

set :npm_flags, ''
set :npm_roles, :web
set :npm_env_variables, {}

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do
  after :published, :build_source do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      within release_path do
        execute release_path.join('node_modules/.bin/webpack'),
                "--progress --config webpack.#{fetch(:stage)}.config.js"
      end
    end
  end
end
