#! /usr/bin/env node
import { program } from 'commander'

program
  .name('shareable')
  .description('Share a local file.')
  .addHelpText(
    'after',
    `
To upload a file from the local directory,
$ shareable <FILENAME>
`
  )
  .argument('<filepath>', 'Path to the file to upload.')
  .action(async filepath => {
    console.log(`Uploading ${filepath}`)
  })
  .parse()
