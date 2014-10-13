#!/usr/bin/env perl

use FindBin;
use lib $FindBin::Dir . "/../lib";

use strict;
use warnings;
use feature "say";

my $upload_meta = "/home/ddgc/cache/all_meta.json";

die unless (-f $upload_meta);

use DDGC;
use JSON;
use IO::All;
use Term::ANSIColor;

my $d = DDGC->new;
my $meta = decode_json(io->file($upload_meta)->slurp);
sub debug { 0 };

say "there are " . (scalar @{$meta}) . " IAs" if debug;

# say JSON->new->utf8(1)->pretty(1)->encode($meta);

my $line = 1;

for my $ia (@{$meta}) {

    if (debug) {
        print color 'red';
        print "$ia->{name}\n";
        print color 'reset';
    }


    if ($ia->{topic}) {
        $ia->{topic} = JSON->new->utf8(1)->encode($ia->{topic});
    }

    if ($ia->{code}) {
        $ia->{code} = JSON->new->utf8(1)->encode($ia->{code});
    }

    if ($ia->{other_queries}) {
        $ia->{other_queries} = JSON->new->utf8(1)->encode($ia->{other_queries});
    }

    $d->rs('InstantAnswer')->update_or_create($ia);    
    

    # debug key val
    # for my $k (keys %{$ia}) {
    #     my $val = $ia->{$k} || "(null)";
    #     print "   $k: ";
    #     print color 'green';
    #     print "$val\n";
    #     print color 'reset';
    # }
    # exit 1 if (++$line > 5);


}
